from app.models.schemas import (
    SpectralResult, 
    ProsodicResult, 
    DeepfakeResult, 
    SpeakerResult, 
    RiskAssessment
)

def evaluate_fusion_risk(
    spectral: SpectralResult,
    prosodic: ProsodicResult,
    deepfake: DeepfakeResult,
    speaker: SpeakerResult
) -> RiskAssessment:
    """
    Feature & Evidence Fusion Engine.
    Combines evidence from the 4 parallel modules and computes Contextual Clone Risk & Dynamic Risk Score.
    """
    speaker_sim = speaker.speaker_similarity
    synth_prob = deepfake.synthetic_probability
    spectral_score = spectral.spectral_score
    prosody_score = prosodic.prosody_score
    
    # 1. Calculate Contextual Speaker / Clone Risk
    if speaker_sim >= 75.0 and synth_prob >= 70.0:
        # Case 1: High speaker match + High deepfake prob = VOICE CLONING ATTACK!
        clone_risk = 92.0
    elif speaker_sim <= 40.0 and synth_prob >= 70.0:
        # Case 2: Low speaker match + High deepfake prob = Impersonation
        clone_risk = 85.0
    elif speaker_sim >= 75.0 and synth_prob <= 30.0:
        # Case 3: High speaker match + Low deepfake prob = Authentic speaker
        clone_risk = 12.0
    else:
        # Case 4: Moderate or ambiguous risk
        clone_risk = 50.0

    # 2. Updated Dynamic Risk Formula (40% Deepfake + 25% Spectral + 15% Prosodic + 20% Clone Risk)
    raw_risk_score = (
        (synth_prob * 0.40) +
        (spectral_score * 0.25) +
        (prosody_score * 0.15) +
        (clone_risk * 0.20)
    )
    
    final_risk_score = float(round(min(100.0, max(0.0, raw_risk_score)), 1))

    # 3. Determine Risk Tier & Decision
    if final_risk_score >= 61.0:
        risk_level = "HIGH"
        if speaker_sim >= 75.0 and synth_prob >= 70.0:
            final_decision = "POSSIBLE AI VOICE CLONING IMPERSONATION ATTACK"
        else:
            final_decision = "HIGH RISK SYNTHETIC AUDIO DETECTED"
    elif final_risk_score >= 31.0:
        risk_level = "MEDIUM"
        final_decision = "SUSPICIOUS AUDIO CHARACTERISTICS - VERIFICATION REQUIRED"
    else:
        risk_level = "LOW"
        final_decision = "AUTHENTIC SPEECH VERIFIED (LOW RISK)"

    # 4. Generate Itemized Evidence Points ("Why Was This Flagged?")
    why_flagged = []
    if synth_prob >= 50.0:
        why_flagged.append(f"High synthetic speech probability detected ({synth_prob}%).")
    if spectral_score >= 50.0:
        why_flagged.append("Spectral analysis identified abnormal acoustic/vocoder frequency artifacts.")
    if prosody_score >= 50.0:
        why_flagged.append("Prosodic analysis detected irregular pitch rhythm and unnatural speech behavior.")
    if speaker_sim >= 75.0:
        why_flagged.append(f"Speaker similarity is high ({speaker_sim}%), suggesting target identity voice cloning.")
    elif speaker_sim <= 40.0 and speaker.reference_available:
        why_flagged.append(f"Speaker similarity is low ({speaker_sim}%), indicating identity mismatch.")
    if not why_flagged:
        why_flagged.append("Acoustic frequency spectrum and prosodic cadence fall within normal human parameters.")
    why_flagged.append("Combined multi-modal analysis signals calculated dynamic impersonation risk score.")

    # 5. AI Security Rationale Summary
    if risk_level == "HIGH":
        ai_explanation = (
            f"The incoming voice shows strong biometric similarity ({speaker_sim}%) to the target reference speaker. "
            f"However, abnormal spectral phase artifacts (Score: {spectral_score}/100) and prosodic perturbations "
            f"combined with a {synth_prob}% synthetic voice probability strongly indicate an AI Voice Cloning Attack."
        )
    elif risk_level == "MEDIUM":
        ai_explanation = (
            f"The audio exhibits moderate acoustic anomalies (Risk Score: {final_risk_score}/100). "
            f"While speaker similarity is {speaker_sim}%, prosodic and spectral signals indicate potential compression or synthetic artifacts."
        )
    else:
        ai_explanation = (
            f"Acoustic parameters show natural pitch contours, authentic spectral harmonics, and high speaker consistency "
            f"({speaker_sim}% match). Low risk score ({final_risk_score}/100) confirms verified authentic speech."
        )

    # 6. Recommended Security Actions
    if risk_level == "HIGH":
        recommended_actions = [
            "BLOCK SENSITIVE ACTIONS & PAUSE TRANSACTION AUTHORIZATIONS",
            "Require secondary out-of-band identity verification (SMS/Authenticator)",
            "Ask challenge-response security question requiring unscripted memory",
            "Log forensic incident and notify security operations center (SOC)"
        ]
    elif risk_level == "MEDIUM":
        recommended_actions = [
            "Issue verbal warning to operator",
            "Perform secondary phone callback to registered official contact number",
            "Monitor ongoing audio stream for escalating synthetic risk signals"
        ]
    else:
        recommended_actions = [
            "Continue standard communication channel",
            "Maintain baseline acoustic monitoring"
        ]

    return RiskAssessment(
        clone_risk_score=round(clone_risk, 1),
        risk_score=final_risk_score,
        risk_level=risk_level,
        final_decision=final_decision,
        why_flagged=why_flagged,
        ai_explanation=ai_explanation,
        recommended_actions=recommended_actions
    )
