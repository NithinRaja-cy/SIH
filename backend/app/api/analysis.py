from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import asyncio
import uuid
import numpy as np
from datetime import datetime
from typing import Optional

from app.audio_processing.preprocessing import AudioPreprocessor
from app.services.spectral_service import spectral_analysis
from app.services.prosodic_service import prosodic_analysis
from app.services.deepfake_service import deepfake_detection
from app.services.speaker_service import speaker_verification
from app.services.fusion_engine import evaluate_fusion_risk
from app.api.audio import REFERENCE_EMBEDDINGS, SESSION_STORE
from app.models.schemas import AudioAnalysisResponse

router = APIRouter(tags=["Parallel Analysis"])
preprocessor = AudioPreprocessor(target_sr=16000)

@router.post("/analyze-audio", response_model=AudioAnalysisResponse)
async def analyze_audio_endpoint(
    file: UploadFile = File(...),
    session_id: Optional[str] = Form(None)
):
    """
    Main Audio Analysis Pipeline Endpoint.
    Concurrently executes the 4 PARALLEL ANALYSIS ENGINES:
    1. Spectral Analysis
    2. Prosodic Analysis
    3. AI Deepfake Detection
    4. Speaker Verification
    """
    try:
        contents = await file.read()
        audio_data, sr = preprocessor.load_audio_bytes(contents)
        prep_res = preprocessor.preprocess_chunk(audio_data, sr=sr)
        clean_audio = prep_res["clean_audio"]
        
        ref_vec = REFERENCE_EMBEDDINGS.get("current", None)
        
        # Dispatch 4 Parallel Tasks using asyncio.gather
        spectral_task = spectral_analysis(clean_audio, sr=sr)
        prosody_task = prosodic_analysis(clean_audio, sr=sr)
        deepfake_task = deepfake_detection(clean_audio, sr=sr)
        speaker_task = speaker_verification(clean_audio, reference_vector=ref_vec, sr=sr)
        
        # Concurrent Execution
        spectral_res, prosody_res, deepfake_res, speaker_res = await asyncio.gather(
            spectral_task,
            prosody_task,
            deepfake_task,
            speaker_task
        )
        
        # Feature & Evidence Fusion & Dynamic Risk Calculation
        risk_res = evaluate_fusion_risk(
            spectral=spectral_res,
            prosodic=prosody_res,
            deepfake=deepfake_res,
            speaker=speaker_res
        )
        
        s_id = session_id or f"VIVA-2026-{uuid.uuid4().hex[:6].upper()}"
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Maintain progressive timeline
        prev_session = SESSION_STORE.get(s_id, None)
        chunk_idx = (prev_session.chunk_index + 1) if prev_session else 1
        
        timeline_entry = {
            "chunk": f"Chunk {chunk_idx}",
            "risk": risk_res.risk_score,
            "synthetic": deepfake_res.synthetic_probability,
            "spectral": spectral_res.spectral_score,
            "speaker": speaker_res.speaker_similarity
        }
        
        existing_timeline = prev_session.timeline if prev_session else []
        new_timeline = existing_timeline + [timeline_entry]
        
        response_data = AudioAnalysisResponse(
            session_id=s_id,
            chunk_index=chunk_idx,
            total_chunks=max(chunk_idx, 1),
            duration_seconds=prep_res["duration"],
            timestamp=now_str,
            preprocessing=prep_res["status"],
            spectral=spectral_res,
            prosodic=prosody_res,
            deepfake=deepfake_res,
            speaker=speaker_res,
            risk=risk_res,
            timeline=new_timeline
        )
        
        SESSION_STORE[s_id] = response_data
        return response_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {str(e)}")

@router.get("/analysis/{session_id}", response_model=AudioAnalysisResponse)
async def get_analysis_session(session_id: str):
    """Retrieves session analysis results by session ID."""
    if session_id in SESSION_STORE:
        return SESSION_STORE[session_id]
    raise HTTPException(status_code=404, detail="Analysis session not found.")
