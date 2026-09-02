import asyncio
import numpy as np
from typing import Optional
from app.audio_processing.feature_extraction import extract_speaker_embedding
from app.models.schemas import SpeakerResult

async def speaker_verification(
    audio_chunk: np.ndarray, 
    reference_vector: Optional[np.ndarray] = None, 
    sr: int = 16000
) -> SpeakerResult:
    """Independent Parallel Analysis Module 4: Real Speaker Verification"""
    await asyncio.sleep(0.02)
    
    chunk_vector = extract_speaker_embedding(audio_chunk, sr=sr)
    
    if reference_vector is not None and len(reference_vector) > 0:
        # Real Cosine Similarity calculation: (A . B) / (||A|| * ||B||)
        dot_product = np.dot(chunk_vector, reference_vector)
        norm_product = (np.linalg.norm(chunk_vector) * np.linalg.norm(reference_vector)) + 1e-9
        cos_sim = float(dot_product / norm_product)
        
        # Convert Cosine Similarity range [-1, 1] to Percentage [0, 100%]
        similarity = float(np.clip((cos_sim + 1.0) / 2.0 * 100.0, 5.0, 99.0))
        ref_available = True
        
        if similarity >= 75.0:
            identity_match = "HIGH"
        elif similarity >= 50.0:
            identity_match = "MODERATE"
        else:
            identity_match = "LOW"
        voice_consistency = round(similarity, 1)
        insight = "Evaluated true cosine embedding similarity against uploaded reference voice profile."
    else:
        # Default baseline when no reference voice profile is provided
        similarity = 75.0
        identity_match = "MODERATE"
        voice_consistency = 75.0
        ref_available = False
        insight = "No reference voice sample uploaded. Upload target victim audio for exact Cosine Similarity matching."

    return SpeakerResult(
        speaker_similarity=round(similarity, 1),
        identity_match=identity_match,
        voice_consistency=round(voice_consistency, 1),
        reference_available=ref_available,
        security_insight=insight,
        status="COMPLETE"
    )
