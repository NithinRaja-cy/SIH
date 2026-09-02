import numpy as np
from datetime import datetime
from app.models.schemas import (
    AudioAnalysisResponse, 
    PreprocessingStatus, 
    SpectralResult, 
    ProsodicResult, 
    DeepfakeResult, 
    SpeakerResult, 
    RiskAssessment
)

def create_demo_audio_data(demo_type: str = "cloned", session_id: str = "VIVA-2026-DEMO") -> AudioAnalysisResponse:
    """Generates precise pre-calculated analysis response object for 1-Click SIH Hackathon Demos."""
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if demo_type.lower() == "genuine":
        preprocessing = PreprocessingStatus(
            audio_captured=True,
            noise_reduced=True,
            vad_detected=True,
            normalized=True,
            chunk_ready=True,
            duration_seconds=2.15,
            sample_rate_hz=16000
        )
        spectral = SpectralResult(
            spectral_score=18.0,
            mfcc_status="consistent",
            lfcc_status="normal",
            spectral_artifacts=False,
            mel_pattern="normal",
            spectral_centroid_hz=1820.0,
            spectral_flatness=0.012,
            risk_level="LOW",
            status="COMPLETE"
        )
        prosodic = ProsodicResult(
            prosody_score=15.0,
            pitch_consistency="natural human flow",
            rhythm_status="natural",
            pause_pattern="regular",
            jitter_status="normal",
            shimmer_status="normal",
            avg_f0_hz=154.5,
            risk_level="LOW",
            status="COMPLETE"
        )
        deepfake = DeepfakeResult(
            synthetic_probability=9.0,
            genuine_probability=91.0,
            classification="GENUINE VOICE LIKELY",
            confidence=91.0,
            status="COMPLETE"
        )
        speaker = SpeakerResult(
            speaker_similarity=91.0,
            identity_match="HIGH",
            voice_consistency=91.0,
            reference_available=True,
            security_insight="High speaker similarity with natural spectral and prosodic flow confirms authentic voice.",
            status="COMPLETE"
        )
        risk = RiskAssessment(
            clone_risk_score=12.0,
            risk_score=14.0,
            risk_level="LOW",
            final_decision="AUTHENTIC SPEECH VERIFIED (LOW RISK)",
            why_flagged=[
                "Natural pitch contour and human vocal cord jitter.",
                "Authentic harmonic spectral energy distribution.",
                "High speaker similarity (91%) matches reference baseline profile."
            ],
            ai_explanation="Acoustic harmonics, prosodic cadence, and speaker embedding similarity confirm authentic human speech.",
            recommended_actions=[
                "Continue communication channel",
                "Maintain baseline acoustic security monitoring"
            ]
        )
        timeline = [
            {"chunk": "Chunk 1", "risk": 12, "synthetic": 8, "spectral": 15, "speaker": 90},
            {"chunk": "Chunk 2", "risk": 14, "synthetic": 9, "spectral": 18, "speaker": 91},
            {"chunk": "Chunk 3", "risk": 13, "synthetic": 7, "spectral": 16, "speaker": 92}
        ]
    else:
        # DEMO 2: AI CLONED VOICE ATTACK
        preprocessing = PreprocessingStatus(
            audio_captured=True,
            noise_reduced=True,
            vad_detected=True,
            normalized=True,
            chunk_ready=True,
            duration_seconds=2.15,
            sample_rate_hz=16000
        )
        spectral = SpectralResult(
            spectral_score=82.0,
            mfcc_status="suspicious",
            lfcc_status="anomalous",
            spectral_artifacts=True,
            mel_pattern="abnormal",
            spectral_centroid_hz=3420.0,
            spectral_flatness=0.085,
            risk_level="HIGH",
            status="COMPLETE"
        )
        prosodic = ProsodicResult(
            prosody_score=68.0,
            pitch_consistency="robotic / unnatural",
            rhythm_status="suspicious",
            pause_pattern="irregular",
            jitter_status="high",
            shimmer_status="high",
            avg_f0_hz=188.2,
            risk_level="MEDIUM-HIGH",
            status="COMPLETE"
        )
        deepfake = DeepfakeResult(
            synthetic_probability=88.0,
            genuine_probability=12.0,
            classification="LIKELY AI-GENERATED",
            confidence=88.0,
            status="COMPLETE"
        )
        speaker = SpeakerResult(
            speaker_similarity=84.0,
            identity_match="HIGH",
            voice_consistency=84.0,
            reference_available=True,
            security_insight="CRITICAL SECURITY INSIGHT: High speaker similarity (84%) matches target victim profile, but parallel acoustic analysis detected AI synthetic voice generation!",
            status="COMPLETE"
        )
        risk = RiskAssessment(
            clone_risk_score=92.0,
            risk_score=87.0,
            risk_level="HIGH",
            final_decision="POSSIBLE AI VOICE CLONING IMPERSONATION ATTACK",
            why_flagged=[
                "High synthetic speech probability detected (88%).",
                "Spectral analysis identified abnormal acoustic & vocoder phase artifacts.",
                "Prosodic analysis detected irregular pitch rhythm and high jitter perturbation.",
                "Speaker similarity is high (84%), indicating cloned identity impersonation."
            ],
            ai_explanation="The incoming voice strongly resembles the reference speaker (84% similarity). However, abnormal spectral phase artifacts and high synthetic probability (88%) confirm a sophisticated AI voice cloning attack.",
            recommended_actions=[
                "BLOCK SENSITIVE ACTIONS & PAUSE TRANSACTION AUTHORIZATIONS",
                "Require secondary out-of-band identity verification (SMS/Authenticator)",
                "Ask challenge-response security question requiring unscripted memory",
                "Log forensic incident and notify security operations center (SOC)"
            ]
        )
        timeline = [
            {"chunk": "Chunk 1", "risk": 18, "synthetic": 25, "spectral": 30, "speaker": 84},
            {"chunk": "Chunk 2", "risk": 35, "synthetic": 42, "spectral": 50, "speaker": 84},
            {"chunk": "Chunk 3", "risk": 57, "synthetic": 65, "spectral": 68, "speaker": 84},
            {"chunk": "Chunk 4", "risk": 76, "synthetic": 78, "spectral": 75, "speaker": 84},
            {"chunk": "Chunk 5", "risk": 87, "synthetic": 88, "spectral": 82, "speaker": 84}
        ]

    return AudioAnalysisResponse(
        session_id=session_id,
        chunk_index=1,
        total_chunks=5 if demo_type == "cloned" else 3,
        duration_seconds=2.15,
        timestamp=now_str,
        preprocessing=preprocessing,
        spectral=spectral,
        prosodic=prosodic,
        deepfake=deepfake,
        speaker=speaker,
        risk=risk,
        timeline=timeline
    )

def generate_synthetic_wave(freq=440.0, duration=2.0, sr=16000, is_cloned=False) -> np.ndarray:
    """Generates synthetic audio waveform array for testing."""
    t = np.linspace(0, duration, int(sr * duration), False)
    if is_cloned:
        # Add high frequency harmonics & Phase jitter simulating neural vocoders
        signal_wave = 0.5 * np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2.5 * t) + 0.1 * np.random.normal(0, 0.05, len(t))
    else:
        # Smooth harmonic voice simulation
        signal_wave = 0.6 * np.sin(2 * np.pi * freq * t) + 0.2 * np.sin(2 * np.pi * freq * 2 * t)
    return signal_wave.astype(np.float32)
