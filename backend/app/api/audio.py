from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import uuid
import numpy as np
from app.audio_processing.preprocessing import AudioPreprocessor
from app.audio_processing.feature_extraction import extract_speaker_embedding
from app.models.schemas import ReferenceVoiceUploadResponse

router = APIRouter(tags=["Audio Management"])

# In-memory store for reference speaker embeddings and sessions
REFERENCE_EMBEDDINGS = {}
SESSION_STORE = {}

preprocessor = AudioPreprocessor(target_sr=16000)

@router.post("/upload-reference-voice", response_model=ReferenceVoiceUploadResponse)
async def upload_reference_voice(
    file: UploadFile = File(...),
    reference_name: Optional[str] = Form("Target Baseline Profile")
):
    """Uploads reference speaker audio sample and extracts biometric acoustic vector."""
    try:
        contents = await file.read()
        audio_data, sr = preprocessor.load_audio_bytes(contents)
        embedding = extract_speaker_embedding(audio_data, sr=sr)
        
        ref_id = str(uuid.uuid4())[:8]
        REFERENCE_EMBEDDINGS[ref_id] = {
            "name": reference_name,
            "vector": embedding,
            "filename": file.filename
        }
        # Set as active reference vector for real-time comparison
        REFERENCE_EMBEDDINGS["current"] = embedding
        
        return ReferenceVoiceUploadResponse(
            status="success",
            message=f"Reference voice profile '{reference_name}' extracted successfully.",
            embedding_size=len(embedding),
            reference_id=ref_id
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process reference voice: {str(e)}")
