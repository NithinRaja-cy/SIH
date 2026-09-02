from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import audio, analysis, reports, websocket

app = FastAPI(
    title="VIVA – Voice Integrity & Verification Architecture",
    description="Real-Time AI Voice Cloning Impersonation Prevention Engine",
    version="2.6.0"
)

# Enable CORS for local web development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(audio.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(websocket.router)

@app.get("/")
async def root():
    return {
        "system": "VIVA – Voice Integrity & Verification Architecture",
        "tagline": "Real-Time Detection and Prevention of AI Voice Cloning Impersonation Attacks",
        "status": "OPERATIONAL",
        "parallel_engines": [
            "1. Spectral Analysis",
            "2. Prosodic Analysis",
            "3. AI Deepfake Detection",
            "4. Speaker Verification"
        ],
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "VIVA Cyber Defense Engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
