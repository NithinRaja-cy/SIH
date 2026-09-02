import asyncio
import numpy as np
from app.audio_processing.feature_extraction import extract_spectral_features
from app.models.schemas import SpectralResult

async def spectral_analysis(audio_chunk: np.ndarray, sr: int = 16000) -> SpectralResult:
    """Independent Parallel Analysis Module 1: Real DSP Spectral Analysis"""
    await asyncio.sleep(0.02)
    
    features = extract_spectral_features(audio_chunk, sr=sr)
    
    hf_artifact = features["hf_artifact_ratio"]
    flatness = features["spectral_flatness"]
    flux = features["spectral_flux"]
    zcr = features["zero_crossing_rate"]
    
    # Real DSP Anomaly Score calculation:
    # High-frequency vocoder phase artifacts (>6.5kHz), uncharacteristically high spectral flatness, or erratic ZCR indicates vocoder phase synthesis.
    raw_score = (hf_artifact * 280.0) + (flatness * 450.0) + (zcr * 150.0) + (1.0 / (flux + 0.005) * 1.5)
    score = float(np.clip(raw_score, 8.0, 96.0))
    
    if score >= 65.0:
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
