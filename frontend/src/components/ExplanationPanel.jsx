import React from 'react';
import { HelpCircle, AlertOctagon, BrainCircuit } from 'lucide-react';

export default function ExplanationPanel({ whyFlagged = [], aiExplanation = '' }) {
  const hasData = (whyFlagged && whyFlagged.length > 0) || aiExplanation;

  const defaultEvidence = [
    "Upload an audio file or record live microphone audio.",
    "Click 'VERIFY AUDIO & RUN PARALLEL ANALYSIS' in the showcase card.",
    "The system will execute 4 parallel analysis modules and display itemized acoustic threat evidence."
  ];

  const defaultNarrative = "Awaiting audio verification and parallel execution. Select an audio file above to generate transparent AI forensic threat rationale.";

  const points = hasData ? whyFlagged : defaultEvidence;
  const explanation = hasData ? aiExplanation : defaultNarrative;

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
