import React from 'react';
import { CheckCircle2, Waves, Sliders, Volume2, Clock } from 'lucide-react';

export default function PreprocessingStatus({ status, duration = 2.0 }) {
  const steps = [
    { label: 'Audio Captured', icon: Volume2, ready: status?.audio_captured ?? true },
    { label: 'Noise Reduced', icon: Waves, ready: status?.noise_reduced ?? true },
    { label: 'Voice Activity Detected', icon: Sliders, ready: status?.vad_detected ?? true },
    { label: 'Audio Normalized', icon: CheckCircle2, ready: status?.normalized ?? true },
    { label: 'Audio Chunk Ready', icon: Clock, ready: status?.chunk_ready ?? true },
  ];

  return (
    <div className="light-card p-4 mb-6 bg-slate-50/80 border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          AUDIO PRE-PROCESSING PIPELINE (16 kHz MONO • 2.0s WINDOW)
        </span>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
          Duration: {duration}s
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className={`flex items-center space-x-2 p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                step.ready
                  ? 'bg-white border-emerald-200 text-emerald-800 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${step.ready ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
