from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import numpy as np
import uuid
import json
from datetime import datetime

from app.audio_processing.preprocessing import AudioPreprocessor
from app.services.spectral_service import spectral_analysis
from app.services.prosodic_service import prosodic_analysis
from app.services.deepfake_service import deepfake_detection
from app.services.speaker_service import speaker_verification
from app.services.fusion_engine import evaluate_fusion_risk
from app.api.audio import REFERENCE_EMBEDDINGS, SESSION_STORE
from app.models.schemas import AudioAnalysisResponse

router = APIRouter(tags=["WebSocket Stream"])
preprocessor = AudioPreprocessor(target_sr=16000)

@router.websocket("/ws/live-analysis")
async def websocket_live_analysis(websocket: WebSocket):
    """
    WebSocket endpoint for real-time PCM / WebM microphone chunk streaming.
    Pushes 4-Module Parallel Analysis updates back to frontend canvas.
    """
    await websocket.accept()
    session_id = f"VIVA-LIVE-{uuid.uuid4().hex[:6].upper()}"
    chunk_counter = 0
    timeline = []
    
    try:
        while True:
            # Receive raw binary PCM bytes or base64 chunk
            data = await websocket.receive_bytes()
            chunk_counter += 1
            
            # 1. Preprocess
            audio_data, sr = preprocessor.load_audio_bytes(data)
            prep_res = preprocessor.preprocess_chunk(audio_data, sr=sr)
            clean_audio = prep_res["clean_audio"]
            
            # Send initial processing status signal
            await websocket.send_text(json.dumps({
                "status": "PROCESSING",
                "chunk_index": chunk_counter,
                "session_id": session_id
            }))
            
            ref_vec = REFERENCE_EMBEDDINGS.get("current", None)
            
            # 2. Concurrently execute 4 Parallel Engines
            spectral_task = spectral_analysis(clean_audio, sr=sr)
            prosody_task = prosodic_analysis(clean_audio, sr=sr)
            deepfake_task = deepfake_detection(clean_audio, sr=sr)
            speaker_task = speaker_verification(clean_audio, reference_vector=ref_vec, sr=sr)
            
            spectral_res, prosody_res, deepfake_res, speaker_res = await asyncio.gather(
                spectral_task,
                prosody_task,
                deepfake_task,
                speaker_task
            )
            
            # 3. Fusion & Risk Calculation
            risk_res = evaluate_fusion_risk(
                spectral=spectral_res,
                prosodic=prosody_res,
                deepfake=deepfake_res,
                speaker=speaker_res
            )
            
            timeline_entry = {
                "chunk": f"Chunk {chunk_counter}",
                "risk": risk_res.risk_score,
                "synthetic": deepfake_res.synthetic_probability,
                "spectral": spectral_res.spectral_score,
                "speaker": speaker_res.speaker_similarity
            }
            timeline.append(timeline_entry)
            
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            response = AudioAnalysisResponse(
                session_id=session_id,
                chunk_index=chunk_counter,
                total_chunks=chunk_counter,
                duration_seconds=prep_res["duration"],
                timestamp=now_str,
                preprocessing=prep_res["status"],
                spectral=spectral_res,
                prosodic=prosody_res,
                deepfake=deepfake_res,
                speaker=speaker_res,
                risk=risk_res,
                timeline=timeline
            )
            
            SESSION_STORE[session_id] = response
            
            # Push completed response payload
            await websocket.send_text(response.model_dump_json())
            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.close()
