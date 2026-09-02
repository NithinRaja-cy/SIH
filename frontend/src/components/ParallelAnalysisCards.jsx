import React from 'react';
import { Music, MessageSquare, Bot, UserCheck, CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react';

export default function ParallelAnalysisCards({ spectral, prosodic, deepfake, speaker, isProcessing }) {
  
  const hasResult = (moduleObj) => moduleObj && moduleObj.status === 'COMPLETE';

  // Status indicator builder
  const renderStatus = (isComp) => {
    if (isProcessing) {
      return (
        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
          <span>● PROCESSING</span>
        </span>
      );
    }
    if (isComp) {
      return (
        <span className="flex items-center space-x-1 py-1 px-2.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>✓ COMPLETE</span>
        </span>
      );
    }
    return (
      <span className="flex items-center space-x-1 py-1 px-2 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
        <Clock className="w-3 h-3 text-slate-400" />
        <span>STANDBY</span>
      </span>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>PARALLEL ANALYSIS ENGINE (4 INDEPENDENT PIPELINES)</span>
          </h2>
          <p className="text-xs text-slate-500">All four modules receive and process the same 2.0s audio chunk concurrently</p>
        </div>
        
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          CONCURRENT EXECUTION
        </span>
      </div>

      {/* 4 Cards Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* CARD 1: SPECTRAL ANALYSIS */}
        <div className="light-card p-5 flex flex-col justify-between border-t-4 border-t-blue-500">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase">🎵 SPECTRAL</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">ACOUSTIC & MEL SPECTRUM</p>
                </div>
              </div>
              {renderStatus(hasResult(spectral))}
            </div>

            <div className="my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-slate-500 font-medium">Spectral Anomaly Score</span>
                <span className="text-xl font-black text-slate-900">
                  {hasResult(spectral) ? spectral.spectral_score : '0'} <span className="text-xs font-semibold text-slate-400">/ 100</span>
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    hasResult(spectral) && spectral.spectral_score >= 60 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${hasResult(spectral) ? spectral.spectral_score : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">MFCC Pattern:</span>
                <span className="font-semibold capitalize text-slate-800">{hasResult(spectral) ? spectral.mfcc_status : 'Awaiting Input'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Spectral Artifacts:</span>
                <span className={`font-semibold ${hasResult(spectral) && spectral.spectral_artifacts ? 'text-rose-600' : 'text-slate-600'}`}>
                  {hasResult(spectral) ? (spectral.spectral_artifacts ? 'DETECTED' : 'CLEAN') : 'Standby'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Mel Pattern:</span>
                <span className="font-semibold capitalize text-slate-800">{hasResult(spectral) ? spectral.mel_pattern : 'Awaiting Input'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">RESULT:</span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold ${
              hasResult(spectral) 
                ? (spectral.risk_level === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700')
                : 'bg-slate-100 text-slate-500'
            }`}>
              {hasResult(spectral) ? (spectral.risk_level === 'HIGH' ? 'HIGH ANOMALY' : 'NORMAL HARMONICS') : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* CARD 2: PROSODIC ANALYSIS */}
        <div className="light-card p-5 flex flex-col justify-between border-t-4 border-t-indigo-500">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase">🗣️ PROSODIC</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">PITCH & CADENCE</p>
                </div>
              </div>
              {renderStatus(hasResult(prosodic))}
            </div>

            <div className="my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-slate-500 font-medium">Prosody Anomaly Score</span>
                <span className="text-xl font-black text-slate-900">
                  {hasResult(prosodic) ? prosodic.prosody_score : '0'} <span className="text-xs font-semibold text-slate-400">/ 100</span>
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    hasResult(prosodic) && prosodic.prosody_score >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${hasResult(prosodic) ? prosodic.prosody_score : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pitch Consistency:</span>
                <span className="font-semibold capitalize text-slate-800">{hasResult(prosodic) ? prosodic.pitch_consistency : 'Awaiting Input'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Speech Rhythm:</span>
                <span className="font-semibold capitalize text-slate-800">{hasResult(prosodic) ? prosodic.rhythm_status : 'Awaiting Input'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Jitter / Perturbation:</span>
                <span className="font-semibold capitalize text-slate-800">{hasResult(prosodic) ? prosodic.jitter_status : 'Awaiting Input'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">RESULT:</span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold ${
              hasResult(prosodic)
                ? (prosodic.prosody_score >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700')
                : 'bg-slate-100 text-slate-500'
            }`}>
              {hasResult(prosodic) ? (prosodic.prosody_score >= 50 ? 'SUSPICIOUS CADENCE' : 'NATURAL CADENCE') : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* CARD 3: AI DEEPFAKE DETECTION */}
        <div className="light-card p-5 flex flex-col justify-between border-t-4 border-t-purple-600">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase">🤖 AI DEEPFAKE</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">NEURAL ANTI-SPOOFING</p>
                </div>
              </div>
              {renderStatus(hasResult(deepfake))}
            </div>

            <div className="my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-slate-500 font-medium">Synthetic Probability</span>
                <span className="text-xl font-black text-purple-700">{hasResult(deepfake) ? deepfake.synthetic_probability : '0'}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 transition-all duration-500"
                  style={{ width: `${hasResult(deepfake) ? deepfake.synthetic_probability : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Genuine Voice Prob:</span>
                <span className="font-semibold text-slate-800">{hasResult(deepfake) ? `${deepfake.genuine_probability}%` : 'Awaiting Input'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Model Classification:</span>
                <span className="font-extrabold text-purple-700">{hasResult(deepfake) ? deepfake.classification : 'Standby'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Confidence Score:</span>
                <span className="font-semibold text-slate-800">{hasResult(deepfake) ? `${deepfake.confidence}%` : 'Awaiting Input'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">VERDICT:</span>
            <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold ${
              hasResult(deepfake)
                ? (deepfake.synthetic_probability >= 50 ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-700')
                : 'bg-slate-100 text-slate-500'
            }`}>
              {hasResult(deepfake) ? deepfake.classification : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* CARD 4: SPEAKER VERIFICATION */}
        <div className="light-card p-5 flex flex-col justify-between border-t-4 border-t-emerald-600">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase">👤 SPEAKER MATCH</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">COSINE SIMILARITY</p>
                </div>
              </div>
              {renderStatus(hasResult(speaker))}
            </div>

            <div className="my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-slate-500 font-medium">Speaker Similarity</span>
                <span className="text-xl font-black text-emerald-700">{hasResult(speaker) ? speaker.speaker_similarity : '0'}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${hasResult(speaker) ? speaker.speaker_similarity : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Identity Match Tier:</span>
                <span className="font-bold text-emerald-700">{hasResult(speaker) ? speaker.identity_match : 'Standby'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Voice Consistency:</span>
                <span className="font-semibold text-slate-800">{hasResult(speaker) ? `${speaker.voice_consistency}%` : 'Awaiting Input'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Target Profile:</span>
                <span className="font-semibold text-slate-800">Inbuilt Baseline Active</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="bg-indigo-50 p-2 rounded border border-indigo-200 flex items-start space-x-1.5 text-[10px] text-indigo-900 font-medium leading-tight">
              <AlertCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <span>Inbuilt target speaker profile loaded for instant Cosine Similarity matching.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
