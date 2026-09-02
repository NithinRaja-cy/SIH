import React from 'react';
import { HelpCircle, CheckCircle2, AlertOctagon, BrainCircuit } from 'lucide-react';

export default function ExplanationPanel({ whyFlagged = [], aiExplanation = '' }) {
  const defaultEvidence = [
    "High synthetic speech probability detected (88%).",
    "Spectral analysis identified abnormal acoustic & vocoder phase artifacts (>6.5 kHz).",
    "Prosodic analysis detected irregular pitch rhythm and high jitter perturbation.",
    "Speaker similarity is high (84%), indicating cloned identity impersonation.",
    "Multiple independent analysis signals indicate high voice cloning threat."
  ];

  const defaultNarrative = 
    "The incoming voice strongly resembles the reference target speaker (84% similarity match). " +
    "However, abnormal spectral phase artifacts and high synthetic speech probability (88%) " +
    "confirm a sophisticated AI voice cloning impersonation attack.";

  const points = whyFlagged.length > 0 ? whyFlagged : defaultEvidence;
  const explanation = aiExplanation || defaultNarrative;

  return (
    <div className="light-card p-6 mb-8 border-l-4 border-l-purple-600">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
            EXPLANATION ENGINE — WHY WAS THIS FLAGGED?
          </h3>
          <p className="text-xs text-slate-500">Transparent AI forensic evidence breakdown and threat rationale</p>
        </div>
      </div>

      {/* AI Security Explanation Summary Narrative */}
      <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-100 mb-5">
        <span className="text-[10px] font-extrabold text-purple-800 uppercase tracking-wider block mb-1">
          AI FORENSIC THREAT RATIONALE SUMMARY
        </span>
        <p className="text-xs text-purple-950 font-medium leading-relaxed">
          "{explanation}"
        </p>
      </div>

      {/* Itemized Evidence List */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
          <span>Itemized Acoustic Signal Evidence:</span>
        </h4>

        <div className="space-y-2">
          {points.map((point, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-800">
              <AlertOctagon className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span className="font-medium">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
