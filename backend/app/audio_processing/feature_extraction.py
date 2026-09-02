import numpy as np
import scipy.signal as signal

def extract_mel_spectrogram(audio: np.ndarray, sr: int = 16000, n_mels: int = 32, n_fft: int = 512, hop_length: int = 256) -> np.ndarray:
    """Calculates a Mel Spectrogram matrix (n_mels x frames) normalized to 0-1 for heatmap visualization."""
    if len(audio) < n_fft:
        audio = np.pad(audio, (0, n_fft - len(audio)))
        
    frequencies, times, Sxx = signal.spectrogram(audio, fs=sr, nperseg=n_fft, noverlap=n_fft - hop_length)
    
    # Simple Mel Filterbank matrix approximation
    mel_matrix = np.zeros((n_mels, Sxx.shape[1]))
    n_freqs = Sxx.shape[0]
    
    for i in range(n_mels):
        start_idx = int(i * (n_freqs / (n_mels + 1)))
        end_idx = int((i + 2) * (n_freqs / (n_mels + 1)))
        if end_idx <= n_freqs:
            mel_matrix[i, :] = np.mean(Sxx[start_idx:end_idx, :], axis=0)
            
    # Log scale & normalize
    mel_matrix = np.log1p(mel_matrix * 1000.0)
    max_val = np.max(mel_matrix)
    if max_val > 0:
        mel_matrix = mel_matrix / max_val
    return mel_matrix

def extract_mfcc(audio: np.ndarray, sr: int = 16000, n_mfcc: int = 13) -> np.ndarray:
    """Extracts MFCC coefficient vector (length n_mfcc)."""
    mel_spec = extract_mel_spectrogram(audio, sr=sr, n_mels=24)
    log_mel = np.log(mel_spec + 1e-6)
    # DCT approximation
    mfccs = np.zeros(n_mfcc)
    for k in range(n_mfcc):
        weights = np.cos(np.pi * k * (np.arange(mel_spec.shape[0]) + 0.5) / mel_spec.shape[0])
        mfccs[k] = np.sum(np.mean(log_mel, axis=1) * weights)
    return mfccs

def extract_spectral_features(audio: np.ndarray, sr: int = 16000) -> dict:
    """Computes Spectral Centroid, Flatness, Flux, Zero Crossing Rate, and High Frequency Phase Artifacts."""
    if len(audio) < 256:
        audio = np.pad(audio, (0, 256 - len(audio)))

    frequencies, times, Sxx = signal.spectrogram(audio, fs=sr, nperseg=512, noverlap=256)
    freq_grid = frequencies[:, np.newaxis]
    
    # 1. Spectral Centroid (Hz)
    magnitude_sum = np.sum(Sxx, axis=0) + 1e-9
    centroid_per_frame = np.sum(freq_grid * Sxx, axis=0) / magnitude_sum
    spectral_centroid = float(np.mean(centroid_per_frame))

    # 2. Spectral Flatness (Geometric Mean / Arithmetic Mean)
    geom_mean = np.exp(np.mean(np.log(Sxx + 1e-12), axis=0))
    arith_mean = np.mean(Sxx, axis=0) + 1e-12
    spectral_flatness = float(np.mean(geom_mean / arith_mean))

    # 3. Spectral Flux (frame-to-frame magnitude difference)
    if Sxx.shape[1] > 1:
        flux = np.mean(np.diff(Sxx, axis=1)**2)
    else:
        flux = 0.05
    spectral_flux = float(flux)

    # 4. Zero Crossing Rate (ZCR)
    zero_crossings = np.sum(np.diff(np.sign(audio) != 0))
    zcr = float(zero_crossings / len(audio))

    # 5. High Frequency Artifact Index (> 6.5 kHz energy ratio)
    hf_cutoff = int(6500 * (512 / sr))
    hf_energy = np.sum(Sxx[hf_cutoff:, :]) if hf_cutoff < Sxx.shape[0] else 0.0
    total_energy = np.sum(Sxx) + 1e-9
    hf_artifact_ratio = float(hf_energy / total_energy)

    return {
        "spectral_centroid_hz": round(spectral_centroid, 1),
        "spectral_flatness": round(spectral_flatness, 4),
        "spectral_flux": round(spectral_flux, 4),
        "zero_crossing_rate": round(zcr, 4),
        "hf_artifact_ratio": round(hf_artifact_ratio, 4),
        "mel_matrix": extract_mel_spectrogram(audio, sr=sr, n_mels=32).tolist()
    }

def extract_pitch_f0(audio: np.ndarray, sr: int = 16000) -> dict:
    """Tracks Pitch (F0), RMS Energy, Jitter, and Shimmer perturbation."""
    if len(audio) < 512:
        return {"avg_f0": 160.0, "f0_contour": [160.0]*10, "energy_contour": [0.5]*10, "jitter": 0.01, "shimmer": 0.02, "pause_ratio": 0.1}

    frame_size = int(0.04 * sr) # 40ms frame
    hop = int(0.02 * sr)
    num_frames = (len(audio) - frame_size) // hop + 1
    
    f0_list = []
    energy_list = []
    
    for i in range(max(1, num_frames)):
        frame = audio[i*hop : i*hop + frame_size]
        if len(frame) < frame_size:
            break
        
        # Energy
        rms = np.sqrt(np.mean(frame**2))
        energy_list.append(float(rms))
        
        # Autocorrelation Pitch estimation
        corr = np.correlate(frame, frame, mode='full')
        corr = corr[len(corr)//2:]
        
        # Min pitch 70Hz (sample 228), Max pitch 400Hz (sample 40)
        min_lag = int(sr / 400)
        max_lag = int(sr / 70)
        
        if len(corr) > max_lag and np.max(corr[min_lag:max_lag]) > 0.01:
            peak_lag = min_lag + np.argmax(corr[min_lag:max_lag])
            f0 = sr / peak_lag
            if 70 <= f0 <= 400:
                f0_list.append(float(f0))
            else:
                f0_list.append(0.0)
        else:
            f0_list.append(0.0)
            
    voiced_f0 = [f for f in f0_list if f > 0]
    avg_f0 = float(np.mean(voiced_f0)) if voiced_f0 else 160.0
    
    # Compute Jitter (pitch perturbation)
    if len(voiced_f0) > 1:
        f0_diffs = np.abs(np.diff(voiced_f0))
        jitter = float(np.mean(f0_diffs) / avg_f0)
    else:
        jitter = 0.012

    # Compute Shimmer (amplitude perturbation)
    if len(energy_list) > 1:
        energy_diffs = np.abs(np.diff(energy_list))
        shimmer = float(np.mean(energy_diffs) / (np.mean(energy_list) + 1e-6))
    else:
        shimmer = 0.025
        
    pause_ratio = float(np.sum(np.array(energy_list) < 0.01) / (len(energy_list) + 1e-6))

    # Normalize contours to 20 points for smooth charts
    if len(f0_list) > 0:
        f0_resampled = np.interp(np.linspace(0, 1, 20), np.linspace(0, 1, len(f0_list)), f0_list).tolist()
        energy_resampled = np.interp(np.linspace(0, 1, 20), np.linspace(0, 1, len(energy_list)), energy_list).tolist()
    else:
        f0_resampled = [160.0] * 20
        energy_resampled = [0.2] * 20

    return {
        "avg_f0_hz": round(avg_f0, 1),
        "f0_contour": [round(x, 1) for x in f0_resampled],
        "energy_contour": [round(x, 3) for x in energy_resampled],
        "jitter": round(jitter, 4),
        "shimmer": round(shimmer, 4),
        "pause_ratio": round(pause_ratio, 2)
    }

def extract_speaker_embedding(audio: np.ndarray, sr: int = 16000) -> np.ndarray:
    """Extracts a 128-dimensional acoustic speaker embedding vector."""
    if len(audio) < 512:
        audio = np.pad(audio, (0, 512 - len(audio)))
    
    mel_spec = extract_mel_spectrogram(audio, sr=sr, n_mels=32)
    # Statistical pooling (mean + std across time frames)
    mean_vec = np.mean(mel_spec, axis=1)
    std_vec = np.std(mel_spec, axis=1)
    max_vec = np.max(mel_spec, axis=1)
    min_vec = np.min(mel_spec, axis=1)
    
    embedding = np.concatenate([mean_vec, std_vec, max_vec, min_vec]) # 128 dimensions
    norm = np.linalg.norm(embedding)
    if norm > 0:
        embedding = embedding / norm
    return embedding
