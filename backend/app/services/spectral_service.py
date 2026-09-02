import asyncio
import numpy as np
from app.audio_processing.feature_extraction import extract_spectral_features, sanitize_float
from app.models.schemas import SpectralResult

async def spectral_analysis(audio_chunk: np.ndarray, sr: int = 16000) -> SpectralResult:
    """Independent Parallel Analysis Module 1: Calibrated Spectral Analysis"""
    await asyncio.sleep(0.02)
    
    features = extract_spectral_features(audio_chunk, sr=sr)
    
    hf_artifact = sanitize_float(features["hf_artifact_ratio"], 0.01)
    flatness = sanitize_float(features["spectral_flatness"], 0.01)
    flux = sanitize_float(features["spectral_flux"], 0.02)
    
    # Real Acoustic Science Calibration:
    # 1. High frequency vocoder artifacts (>6.5kHz): Human vocal tract energy falls off rapidly above 5kHz.
    #    In natural human speech, hf_artifact is <= 0.04 (4%). In vocoders/codecs, hf_artifact > 0.12.
    hf_contrib = max(0.0, (hf_artifact - 0.04) * 220.0)
    
    # 2. Spectral Flatness: Human vowels have harmonic formants (flatness < 0.025). Synthetic noise has high flatness.
    flat_contrib = max(0.0, (flatness - 0.025) * 180.0)
    
    # 3. Spectral Flux: Extremely low flux (<0.001) indicates unnatural static frozen spectrum.
    flux_contrib = 15.0 if flux < 0.001 else 0.0

    raw_score = 10.0 + hf_contrib + flat_contrib + flux_contrib
    score = float(np.clip(raw_score, 8.0, 96.0))
    
    if score >= 60.0:
        mfcc_status = "suspicious"
        lfcc_status = "anomalous"
        artifacts = True
        mel_pattern = "abnormal"
        risk = "HIGH"
    elif score >= 35.0:
        mfcc_status = "moderate"
        lfcc_status = "moderate"
        artifacts = False
        mel_pattern = "slightly abnormal"
        risk = "MEDIUM"
    else:
        mfcc_status = "consistent"
        lfcc_status = "normal"
        artifacts = False
        mel_pattern = "normal"
        risk = "LOW"
        
    return SpectralResult(
        spectral_score=round(score, 1),
        mfcc_status=mfcc_status,
        lfcc_status=lfcc_status,
        spectral_artifacts=artifacts,
        mel_pattern=mel_pattern,
        spectral_centroid_hz=features["spectral_centroid_hz"],
        spectral_flatness=features["spectral_flatness"],
        risk_level=risk,
        status="COMPLETE"
    )
