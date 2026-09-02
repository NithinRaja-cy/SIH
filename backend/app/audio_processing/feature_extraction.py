import numpy as np
import scipy.signal as signal

def sanitize_float(val, default=0.0):
    """Replaces NaN, Inf, or non-finite values with a safe float."""
    try:
        f = float(val)
        if np.isnan(f) or np.isinf(f):
            return float(default)
        return float(f)
    except Exception:
        return float(default)

def sanitize_list(lst, default=0.0):
    """Sanitizes a 1D or 2D list/array to contain no NaNs or Infs."""
    if isinstance(lst, np.ndarray):
        lst = np.nan_to_num(lst, nan=default, posinf=default, neginf=default).tolist()
    cleaned = []
    for item in lst:
        if isinstance(item, list):
            cleaned.append([sanitize_float(x, default) for x in item])
        else:
            cleaned.append(sanitize_float(item, default))
    return cleaned

def extract_mel_spectrogram(audio: np.ndarray, sr: int = 16000, n_mels: int = 32, n_fft: int = 512, hop_length: int = 256) -> np.ndarray:
    """Calculates a Mel Spectrogram matrix (n_mels x frames) normalized to 0-1 for heatmap visualization."""
    if len(audio) < n_fft:
        audio = np.pad(audio, (0, n_fft - len(audio)))
        
    frequencies, times, Sxx = signal.spectrogram(audio, fs=sr, nperseg=n_fft, noverlap=n_fft - hop_length)
    Sxx = np.nan_to_num(Sxx, nan=0.0, posinf=0.0, neginf=0.0)
    
    mel_matrix = np.zeros((n_mels, Sxx.shape[1]))
    n_freqs = Sxx.shape[0]
    
    for i in range(n_mels):
        start_idx = int(i * (n_freqs / (n_mels + 1)))
        end_idx = int((i + 2) * (n_freqs / (n_mels + 1)))
        if end_idx <= n_freqs:
            mel_matrix[i, :] = np.mean(Sxx[start_idx:end_idx, :], axis=0)
            
    mel_matrix = np.log1p(mel_matrix * 1000.0)
    mel_matrix = np.nan_to_num(mel_matrix, nan=0.0, posinf=0.0, neginf=0.0)
    max_val = np.max(mel_matrix)
    if max_val > 0.00001:
        mel_matrix = mel_matrix / max_val
    else:
        mel_matrix = np.zeros_like(mel_matrix)
    return mel_matrix

def extract_mfcc(audio: np.ndarray, sr: int = 16000, n_mfcc: int = 13) -> np.ndarray:
    """Extracts MFCC coefficient vector (length n_mfcc)."""
    mel_spec = extract_mel_spectrogram(audio, sr=sr, n_mels=24)
    log_mel = np.log(mel_spec + 1e-6)
    log_mel = np.nan_to_num(log_mel, nan=0.0, posinf=0.0, neginf=0.0)
    mfccs = np.zeros(n_mfcc)
    for k in range(n_mfcc):
        weights = np.cos(np.pi * k * (np.arange(mel_spec.shape[0]) + 0.5) / mel_spec.shape[0])
        mfccs[k] = np.sum(np.mean(log_mel, axis=1) * weights)
    return np.nan_to_num(mfccs, nan=0.0, posinf=0.0, neginf=0.0)

def extract_spectral_features(audio: np.ndarray, sr: int = 16000) -> dict:
    """Computes Spectral Centroid, Flatness, Flux, Zero Crossing Rate, and High Frequency Phase Artifacts."""
    if len(audio) < 256:
        audio = np.pad(audio, (0, 256 - len(audio)))

    audio = np.nan_to_num(audio, nan=0.0, posinf=0.0, neginf=0.0)

    frequencies, times, Sxx = signal.spectrogram(audio, fs=sr, nperseg=512, noverlap=256)
    Sxx = np.nan_to_num(Sxx, nan=0.0, posinf=0.0, neginf=0.0)
    freq_grid = frequencies[:, np.newaxis]
    
    # 1. Spectral Centroid (Hz)
    magnitude_sum = np.sum(Sxx, axis=0) + 1e-9
    centroid_per_frame = np.sum(freq_grid * Sxx, axis=0) / magnitude_sum
    spectral_centroid = float(np.mean(centroid_per_frame))

    # 2. Spectral Flatness
    geom_mean = np.exp(np.mean(np.log(Sxx + 1e-12), axis=0))
    arith_mean = np.mean(Sxx, axis=0) + 1e-12
    spectral_flatness = float(np.mean(geom_mean / arith_mean))

    # 3. Spectral Flux
    if Sxx.shape[1] > 1:
        flux = np.mean(np.diff(Sxx, axis=1)**2)
    else:
        flux = 0.05
    spectral_flux = float(flux)

    # 4. Zero Crossing Rate (ZCR)
    zero_crossings = np.sum(np.diff(np.sign(audio) != 0))
    zcr = float(zero_crossings / max(1, len(audio)))

    # 5. High Frequency Artifact Index (> 6.5 kHz energy ratio)
    hf_cutoff = int(6500 * (512 / sr))
    hf_energy = np.sum(Sxx[hf_cutoff:, :]) if hf_cutoff < Sxx.shape[0] else 0.0
    total_energy = np.sum(Sxx) + 1e-9
    hf_artifact_ratio = float(hf_energy / total_energy)

    mel_mat = extract_mel_spectrogram(audio, sr=sr, n_mels=32)

    return {
        "spectral_centroid_hz": round(sanitize_float(spectral_centroid, 1850.0), 1),
        "spectral_flatness": round(sanitize_float(spectral_flatness, 0.015), 4),
        "spectral_flux": round(sanitize_float(spectral_flux, 0.02), 4),
        "zero_crossing_rate": round(sanitize_float(zcr, 0.05), 4),
        "hf_artifact_ratio": round(sanitize_float(hf_artifact_ratio, 0.01), 4),
        "mel_matrix": sanitize_list(mel_mat, 0.0)
    }

def extract_pitch_f0(audio: np.ndarray, sr: int = 16000) -> dict:
    """Tracks Pitch (F0), RMS Energy, Jitter, and Shimmer perturbation."""
    if len(audio) < 512:
        return {"avg_f0_hz": 160.0, "f0_contour": [160.0]*20, "energy_contour": [0.5]*20, "jitter": 0.01, "shimmer": 0.02, "pause_ratio": 0.1}

    audio = np.nan_to_num(audio, nan=0.0, posinf=0.0, neginf=0.0)

    frame_size = int(0.04 * sr)
    hop = int(0.02 * sr)
    num_frames = (len(audio) - frame_size) // hop + 1
    
    f0_list = []
    energy_list = []
    
    for i in range(max(1, num_frames)):
        frame = audio[i*hop : i*hop + frame_size]
        if len(frame) < frame_size:
            break
        
        rms = np.sqrt(np.mean(frame**2))
        rms = sanitize_float(rms, 0.0)
        energy_list.append(rms)
        
        corr = np.correlate(frame, frame, mode='full')
        corr = corr[len(corr)//2:]
        corr = np.nan_to_num(corr, nan=0.0, posinf=0.0, neginf=0.0)
        
        min_lag = int(sr / 400)
        max_lag = int(sr / 70)
        
        if len(corr) > max_lag and np.max(corr[min_lag:max_lag]) > 0.01:
            peak_lag = min_lag + np.argmax(corr[min_lag:max_lag])
            f0 = sr / max(1, peak_lag)
            if 70 <= f0 <= 400:
                f0_list.append(sanitize_float(f0, 160.0))
            else:
                f0_list.append(0.0)
        else:
            f0_list.append(0.0)
            
    voiced_f0 = [f for f in f0_list if f > 0]
    avg_f0 = float(np.mean(voiced_f0)) if voiced_f0 else 160.0
    avg_f0 = sanitize_float(avg_f0, 160.0)

    if len(voiced_f0) > 1:
        f0_diffs = np.abs(np.diff(voiced_f0))
        jitter = float(np.mean(f0_diffs) / max(1.0, avg_f0))
    else:
        jitter = 0.012
    jitter = sanitize_float(jitter, 0.012)

    if len(energy_list) > 1:
        energy_diffs = np.abs(np.diff(energy_list))
        shimmer = float(np.mean(energy_diffs) / (np.mean(energy_list) + 1e-6))
    else:
        shimmer = 0.025
    shimmer = sanitize_float(shimmer, 0.025)

    pause_ratio = float(np.sum(np.array(energy_list) < 0.01) / max(1, len(energy_list)))
    pause_ratio = sanitize_float(pause_ratio, 0.1)

    if len(f0_list) > 0:
        f0_resampled = np.interp(np.linspace(0, 1, 20), np.linspace(0, 1, len(f0_list)), f0_list).tolist()
        energy_resampled = np.interp(np.linspace(0, 1, 20), np.linspace(0, 1, len(energy_list)), energy_list).tolist()
    else:
        f0_resampled = [160.0] * 20
        energy_resampled = [0.2] * 20

    return {
        "avg_f0_hz": round(avg_f0, 1),
        "f0_contour": [round(sanitize_float(x, 160.0), 1) for x in f0_resampled],
        "energy_contour": [round(sanitize_float(x, 0.2), 3) for x in energy_resampled],
        "jitter": round(jitter, 4),
        "shimmer": round(shimmer, 4),
        "pause_ratio": round(pause_ratio, 2)
    }

def extract_speaker_embedding(audio: np.ndarray, sr: int = 16000) -> np.ndarray:
    """Extracts a 128-dimensional acoustic speaker embedding vector."""
    if len(audio) < 512:
        audio = np.pad(audio, (0, 512 - len(audio)))
    
    audio = np.nan_to_num(audio, nan=0.0, posinf=0.0, neginf=0.0)

    mel_spec = extract_mel_spectrogram(audio, sr=sr, n_mels=32)
    mean_vec = np.mean(mel_spec, axis=1)
    std_vec = np.std(mel_spec, axis=1)
    max_vec = np.max(mel_spec, axis=1)
    min_vec = np.min(mel_spec, axis=1)
    
    embedding = np.concatenate([mean_vec, std_vec, max_vec, min_vec])
    embedding = np.nan_to_num(embedding, nan=0.0, posinf=0.0, neginf=0.0)

    norm = np.linalg.norm(embedding)
    if norm > 0.00001:
        embedding = embedding / norm
    else:
        embedding = np.zeros_like(embedding)
    return embedding
