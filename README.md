# VIVA – Voice Integrity & Verification Architecture 🛡️🎙️
> **Real-Time Detection and Prevention of AI Voice Cloning Impersonation Attacks.**

---

## 📌 System Overview

**VIVA (Voice Integrity & Verification Architecture)** is a production-grade cybersecurity platform engineered to combat real-time AI voice cloning attacks (vishing, fraudulent transaction authorization, caller impersonation).

Incoming live microphone streams or audio files are continuously preprocessed and dispatched simultaneously across **four independent parallel analysis pipelines**:

1. **🎵 Spectral Analysis Pipeline**: MFCC patterns, Mel Spectrogram matrix, Spectral Centroid, Flatness, Flux, and high-frequency neural vocoder phase artifacts (> 6.5 kHz).
2. **🗣️ Prosodic Analysis Pipeline**: Fundamental Frequency ($F_0$) pitch tracking contour, RMS energy, rhythm/pause patterns, Jitter, and Shimmer perturbations.
3. **🤖 AI Deepfake Detection Engine**: Modular anti-spoofing pipeline abstraction (`DeepfakeDetector`) outputting Genuine vs Synthetic probabilities and vocoder threat classifications.
4. **👤 Speaker Verification Engine**: Biometric acoustic embedding extraction & Cosine Similarity matching against target reference voice profiles.

---

## 🏗️ System Architecture

```
                         [ VOICE INPUT ]
                  (Live Mic / Audio File Upload)
                               │
                               ▼
               [ AUDIO PREPROCESSING PIPELINE ]
      (Mono • 16kHz Resample • Peak Normalize • VAD Trim)
                               │
                               ▼
                    [ 2.0s CHUNKING WINDOW ]
                               │
          ┌────────────────────┼────────────────────┬────────────────────┐
          │                    │                    │                    │
          ▼                    ▼                    ▼                    ▼
   [ 🎵 SPECTRAL ]      [ 🗣️ PROSODIC ]      [ 🤖 DEEPFAKE ]      [ 👤 SPEAKER ]
     ANALYSIS             ANALYSIS             DETECTION           VERIFICATION
    (MFCC/Mel)          (Pitch/Jitter)       (Anti-Spoofing)      (Cosine Sim)
          │                    │                    │                    │
          └────────────────────┼────────────────────┴────────────────────┘
                               │ (asyncio.gather - 4 Parallel Tasks)
                               ▼
                 [ FEATURE & EVIDENCE FUSION ]
                               │
                               ▼
             [ DYNAMIC RISK INTELLIGENCE ENGINE (0-100) ]
       (Deepfake 40% + Spectral 25% + Prosodic 15% + Clone Risk 20%)
                               │
                               ▼
                [ EXPLANATION & ACTION ENGINE ]
```

---

## ⚡ Quick Start & Run Instructions

### 1. Start FastAPI Backend Server
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend runs on `http://localhost:8000` (API docs at `http://localhost:8000/docs`).*

### 2. Start React Frontend Dashboard
```bash
cd frontend
npm run dev
```
*Frontend opens on `http://localhost:3000`.*
