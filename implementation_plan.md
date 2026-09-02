# Implementation Plan - VIVA (Voice Integrity & Verification Architecture)

Building a full-stack, near-real-time AI cybersecurity platform for Smart India Hackathon 2026 designed to detect and mitigate AI Voice Cloning Impersonation Attacks.

---

## 🏗️ Architecture & Component Overview

```
                          [ VOICE INPUT ]
               (Live Mic / Audio Upload / SIH Demo Mode)
                               │
                               ▼
               [ AUDIO PREPROCESSING PIPELINE ]
      (Mono Conversion • 16kHz Resample • Normalization • VAD)
                               │
                               ▼
                     [ 1–3s AUDIO CHUNKING ]
                               │
               ┌───────────────┼───────────────┐
               │               │               │
               ▼               ▼               ▼
        [ SPECTRAL ]     [ PROSODIC ]     [ SPEAKER ]
         ANALYSIS         ANALYSIS        ANALYSIS
        (MFCC/Mel)      (Pitch/Jitter)  (Cosine Sim)
               │               │               │
               └───────────────┼───────────────┘
                               │ (asyncio.gather)
                               ▼
                 [ FEATURE & EVIDENCE FUSION ]
                               │
                               ▼
                   [ AI DEEPFAKE CLASSIFIER ]
                               │
                               ▼
                  [ DYNAMIC RISK ENGINE (0–100) ]
               (LOW 0–30 | MEDIUM 31–60 | HIGH 61–100)
                               │
                               ▼
                 [ EXPLANATION & ACTION ENGINE ]
                               │
                               ▼
               [ LIGHT-THEME SOC DASHBOARD & REPORT ]
```

---

## Proposed Technical Implementation

### 1. Backend Service (`backend/`)
- **Framework**: FastAPI with `asyncio` for non-blocking parallel pipelines, `uvicorn` web server, WebSockets (`/ws/live-analysis`) for continuous chunk streaming.
- **Audio Processing**:
  - `preprocessing.py`: Resampling to 16kHz mono, peak amplitude normalization, voice activity detection (VAD), silence trimming, and 1-3 sec sliding window chunker.
  - `feature_extraction.py`: MFCC matrix generation, Mel Spectrogram band matrix, Spectral Centroid, Flatness, Flux, Zero Crossing Rate, pitch ($F_0$) estimation, RMS energy, Jitter, Shimmer.
- **Parallel Analysis Modules**:
  - `spectral_service.py`: Computes high-frequency vocoder phase artifacts and acoustic spectrum variance score (0–100).
  - `prosodic_service.py`: Analyzes pitch perturbation, speech rhythm regularity, energy dropouts, and prosodic anomaly score (0–100).
  - `speaker_service.py`: Extracts acoustic speaker embeddings and evaluates cosine similarity against uploaded or baseline reference voice profiles.
- **AI Deepfake Intelligence & Fusion**:
  - `deepfake_service.py`: Modular `DeepfakeDetector` class interface producing Genuine vs Synthetic probability and classification confidence.
  - `risk_engine.py`: Dynamic Risk Score formula ($R = P_{\text{synthetic}} \times 0.40 + S_{\text{spectral}} \times 0.25 + S_{\text{prosody}} \times 0.15 + R_{\text{speaker}} \times 0.20$), maintaining live session multi-chunk timeline progression.
  - `explanation_service.py`: Explainable AI (XAI) evidence synthesizer explaining flagged acoustic anomalies.
- **Reporting & API Routes**:
  - `report_service.py`: Generates official PDF Security Incident Reports via `ReportLab` and structured JSON exports.
  - `demo_audio.py`: Native synthetic and genuine voice generator engines for seamless 1-click SIH Demo presentations without external file dependencies.

### 2. Frontend Application (`frontend/`)
- **Framework & Styling**: React 18 + Vite + Tailwind CSS + Lucide React Icons + Recharts.
- **Design System**: Light Enterprise Theme (Off-white `#F8FAFC`, Crisp White Cards `#FFFFFF`, Primary Blue `#2563EB`, Success Green `#16A34A`, Warning Amber `#F59E0B`, Critical Red `#DC2626`, Accent Purple `#7C3AED`).
- **Pages & Navigation**:
  - **Home**: Platform overview, interactive pipeline diagram, key security insight callout (High Speaker Match vs Deepfake Detection), quick start CTA.
  - **Live Analysis Dashboard**:
    - **Audio Controls**: Live Microphone (Web Audio API), File Upload with drag-and-drop & audio player, Reference Voice Upload, and 1-Click SIH Demo triggers (`RUN GENUINE DEMO` / `RUN CLONED DEMO`).
    - **Audio Preprocessing Status Bar**: Visual checkmarks for Audio Capture, Noise Reduction, VAD, Normalization, Chunk Ready.
    - **Oscilloscope Waveform & Canvas Mel Spectrogram**: Real-time canvas rendering of audio waveform and spectral heatmap.
    - **3 Parallel Analysis Cards**: Visual status badges (`PROCESSING` concurrently $\rightarrow$ `COMPLETE`), detailed metric bars, and individual risk tiers.
    - **Deepfake Classifier & Fusion Card**: Genuine vs Synthetic percentage bars, classification verdict, confidence rating.
    - **Dynamic Risk Gauge & Timeline**: Radial risk meter, risk level status (LOW / MEDIUM / HIGH), multi-chunk Recharts line graph.
    - **Explainable AI Rationale & Security Actions**: Itemized evidence points, AI narrative summary, and action triggers (Pause, Challenge, Escalate, Incident Report).
  - **Results Summary View**: Full session summary breakdown, metric tables, decision rationale, PDF/JSON export modal.
  - **Reports & Incident History**: Searchable audit log of past audio analysis sessions with live PDF download.

---

## 🛠️ Verification Plan

### Automated & Unit Verification
1. **Backend API Test Suite**:
   - Verify `/api/analyze-audio` returns valid JSON matching all schema requirements.
   - Verify `/api/upload-reference-voice` stores speaker profile embedding.
   - Verify `/api/demo/cloned` and `/api/demo/genuine` respond with expected risk scores and explanations.
   - Verify `/api/generate-report` generates a valid downloadable PDF file.
   - Verify `/ws/live-analysis` WebSocket connection handles chunk streaming.
2. **Frontend Build Verification**:
   - Verify `npm run build` compiles cleanly with no syntax errors.

### Manual & Interactive Verification
1. Launch full backend (`uvicorn`) and frontend (`npm run dev`).
2. Run **SIH Demo 1 (Genuine Voice)**: Verify Low Risk (~14/100), High Speaker Match (~91%), Genuine classification.
3. Run **SIH Demo 2 (Cloned Voice)**: Verify High Risk (~87/100), High Speaker Match (~84%), High Spectral Anomaly (~82), Deepfake Synthetic Probability (~88%), Key Security Insight callout.
4. Test **File Upload** and **Live Microphone** audio capture workflows.
5. Export PDF Incident Report and check formatted sections.
