from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import uuid
import numpy as np
from app.audio_processing.preprocessing import AudioPreprocessor
from app.audio_processing.feature_extraction import extract_speaker_embedding
from app.models.schemas import ReferenceVoiceUploadResponse

router = APIRouter(tags=["Audio Management"])

preprocessor = AudioPreprocessor(target_sr=16000)

# Generate an inbuilt 128-dimensional target speaker embedding profile
def generate_inbuilt_target_embedding() -> np.ndarray:
    """Generates an inbuilt default target victim speaker embedding vector."""
    np.random.seed(42) # Deterministic baseline vector
    t = np.linspace(0, 2.0, 32000, False)
    # Synthetic clean human speech spectrum simulation
    base_wave = 0.5 * np.sin(2 * np.pi * 160 * t) + 0.25 * np.sin(2 * np.pi * 320 * t) + 0.1 * np.sin(2 * np.pi * 480 * t)
    embedding = extract_speaker_embedding(base_wave.astype(np.float32), sr=16000)
    return embedding

# Initialize in-memory store with inbuilt target profile
INBUILT_TARGET_VECTOR = generate_inbuilt_target_embedding()
REFERENCE_EMBEDDINGS = {
    "current": INBUILT_TARGET_VECTOR,
    "inbuilt": {
        "name": "Inbuilt Default Target Baseline Profile",
        "vector": INBUILT_TARGET_VECTOR,
        "filename": "inbuilt_target_voice.wav"
    }
}
SESSION_STORE = {}

@router.post("/upload-reference-voice", response_model=ReferenceVoiceUploadResponse)
async def upload_reference_voice(
    file: UploadFile = File(...),
    reference_name: Optional[str] = Form("Custom Target Baseline Profile")
):
    """Uploads custom reference speaker audio sample to override the inbuilt target profile."""
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
        # Override active current reference vector
        REFERENCE_EMBEDDINGS["current"] = embedding
        
        return ReferenceVoiceUploadResponse(
            status="success",
            message=f"Custom target voice profile '{reference_name}' active (overrode inbuilt baseline).",
            embedding_size=len(embedding),
            reference_id=ref_id
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process reference voice: {str(e)}")
