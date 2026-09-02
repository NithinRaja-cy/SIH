from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PreprocessingStatus(BaseModel):
    audio_captured: bool = True
    noise_reduced: bool = True
    vad_detected: bool = True
    normalized: bool = True
    chunk_ready: bool = True
    duration_seconds: float = 2.0
    sample_rate_hz: int = 16000

class SpectralResult(BaseModel):
    spectral_score: float = Field(..., description="0-100 Anomaly score")
    mfcc_status: str = "consistent" # "consistent", "suspicious", "anomalous"
    lfcc_status: str = "normal"
    spectral_artifacts: bool = False
    mel_pattern: str = "normal" # "normal", "abnormal"
    spectral_centroid_hz: float = 1850.0
    spectral_flatness: float = 0.015
    risk_level: str = "LOW" # "LOW", "MEDIUM", "HIGH"
    status: str = "COMPLETE"

class ProsodicResult(BaseModel):
    prosody_score: float = Field(..., description="0-100 Anomaly score")
    pitch_consistency: str = "natural human flow" # "natural human flow", "moderate", "robotic / unnatural"
    rhythm_status: str = "natural"
    pause_pattern: str = "regular"
    jitter_status: str = "normal"
    shimmer_status: str = "normal"
    avg_f0_hz: float = 165.0
    risk_level: str = "LOW"
    status: str = "COMPLETE"

class DeepfakeResult(BaseModel):
    synthetic_probability: float = Field(..., description="0-100 percentage")
    genuine_probability: float = Field(..., description="0-100 percentage")
    classification: str = "GENUINE VOICE LIKELY" # "GENUINE VOICE LIKELY", "LIKELY AI-GENERATED"
    confidence: float = 90.0
    status: str = "COMPLETE"

class SpeakerResult(BaseModel):
    speaker_similarity: float = Field(..., description="0-100 percentage Cosine Similarity")
    identity_match: str = "MODERATE" # "LOW", "MODERATE", "HIGH"
    voice_consistency: float = 80.0
    reference_available: bool = False
    security_insight: str = "Evaluated cosine similarity of speaker biometric vector against target baseline."
    status: str = "COMPLETE"

class RiskAssessment(BaseModel):
    clone_risk_score: float = Field(..., description="Contextual clone risk 0-100")
    risk_score: float = Field(..., description="Final Dynamic Risk Score 0-100")
    risk_level: str = "LOW" # "LOW", "MEDIUM", "HIGH"
    final_decision: str = "AUTHENTIC SPEECH VERIFIED (LOW RISK)"
    why_flagged: List[str] = []
    ai_explanation: str = ""
    recommended_actions: List[str] = []

class AudioAnalysisResponse(BaseModel):
    session_id: str
    chunk_index: int = 1
    total_chunks: int = 1
    duration_seconds: float = 2.0
    timestamp: str
    preprocessing: PreprocessingStatus
    spectral: SpectralResult
    prosodic: ProsodicResult
    deepfake: DeepfakeResult
    speaker: SpeakerResult
    risk: RiskAssessment
    timeline: List[Dict[str, Any]] = []

class ReferenceVoiceUploadResponse(BaseModel):
    status: str = "success"
    message: str = "Reference voice profile vector generated and saved."
    embedding_size: int = 128
    reference_id: str
