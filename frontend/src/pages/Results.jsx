import React from 'react';
import { Download, FileText, CheckCircle, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { getPdfReportUrl, getJsonReportUrl } from '../services/api';

export default function Results({ analysisData }) {
  const data = analysisData || {
    session_id: 'VIVA-2026-001',
    duration_seconds: 2.15,
    timestamp: '2026-09-02 21:15:00',
    spectral: { spectral_score: 82, risk_level: 'HIGH', mel_pattern: 'abnormal', mfcc_status: 'suspicious' },
    prosodic: { prosody_score: 68, risk_level: 'MEDIUM-HIGH', pitch_consistency: 'robotic / unnatural', jitter_status: 'high' },
    deepfake: { synthetic_probability: 88, genuine_probability: 12, classification: 'LIKELY AI-GENERATED', confidence: 88 },
    speaker: { speaker_similarity: 84, identity_match: 'HIGH', reference_available: true },
    risk: {
      risk_score: 87,
      risk_level: 'HIGH',
      final_decision: 'POSSIBLE AI VOICE CLONING IMPERSONATION ATTACK',
      why_flagged: [
        "High synthetic speech probability detected (88%).",
        "Spectral analysis identified abnormal acoustic phase artifacts.",
        "Prosodic analysis detected irregular pitch rhythm and high jitter perturbation.",
        "Speaker similarity is high (84%), indicating cloned identity impersonation."
      ],
      recommended_actions: [
        "BLOCK SENSITIVE ACTIONS & PAUSE TRANSACTION AUTHORIZATIONS",
        "Require secondary out-of-band identity verification (SMS/Authenticator)",
        "Ask challenge-response security question requiring unscripted memory",
        "Log forensic incident and notify security operations center (SOC)"
      ]
    }
  };

  const pdfUrl = getPdfReportUrl(data.session_id);
  const jsonUrl = getJsonReportUrl(data.session_id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="light-card p-8 bg-white border-t-8 border-t-blue-600 shadow-xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">ANALYSIS SUMMARY & AUDIT</h1>
            <p className="text-xs text-slate-500 font-medium">Session Identifier: <span className="font-mono text-blue-600 font-bold">{data.session_id}</span></p>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD PDF REPORT</span>
            </a>

            <a
              href={jsonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200"
            >
              <FileText className="w-4 h-4" />
              <span>EXPORT JSON</span>
            </a>
          </div>
        </div>

        {/* Section Breakdown Grid */}
        <div className="divide-y divide-slate-100 space-y-6 pt-6">
          
          {/* SPECTRAL ANALYSIS */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SPECTRAL ANALYSIS</h3>
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 font-medium">Score:</span>
                <span className="text-xl font-black text-slate-900 ml-2">{data.spectral.spectral_score} / 100</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                data.spectral.risk_level === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {data.spectral.risk_level === 'HIGH' ? 'HIGH ANOMALY' : 'NORMAL HARMONICS'}
              </span>
            </div>
          </div>

          {/* PROSODIC ANALYSIS */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">PROSODIC ANALYSIS</h3>
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 font-medium">Score:</span>
                <span className="text-xl font-black text-slate-900 ml-2">{data.prosodic.prosody_score} / 100</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                SUSPICIOUS CADENCE
              </span>
            </div>
          </div>

          {/* AI DEEPFAKE DETECTION */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI DEEPFAKE DETECTION</h3>
            <div className="flex items-center justify-between bg-purple-50 p-4 rounded-xl border border-purple-200">
              <div>
                <span className="text-xs text-purple-700 font-medium">Synthetic Probability:</span>
                <span className="text-xl font-black text-purple-950 ml-2">{data.deepfake.synthetic_probability}%</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-200 text-purple-900">
                {data.deepfake.classification}
              </span>
            </div>
          </div>

          {/* SPEAKER VERIFICATION */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">SPEAKER VERIFICATION</h3>
            <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              <div>
                <span className="text-xs text-emerald-700 font-medium">Speaker Similarity:</span>
                <span className="text-xl font-black text-emerald-950 ml-2">{data.speaker.speaker_similarity}%</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-200 text-emerald-900">
                HIGH IDENTITY SIMILARITY
              </span>
            </div>
          </div>

          {/* FINAL RISK ASSESSMENT */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">FINAL RISK ASSESSMENT</h3>
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase">Dynamic Risk Score</span>
                <span className="text-3xl font-black text-rose-400">{data.risk.risk_score} <span className="text-xs font-semibold text-slate-400">/ 100</span></span>
              </div>

              <div className="p-3 bg-rose-950/80 rounded-xl border border-rose-800/80 text-center">
                <span className="text-[10px] font-bold text-rose-300 uppercase tracking-widest block mb-1">AUTOMATED FINAL DECISION</span>
                <h4 className="text-base font-extrabold text-rose-200">{data.risk.final_decision}</h4>
              </div>
            </div>
          </div>

          {/* WHY WAS THIS FLAGGED */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">WHY WAS THIS FLAGGED?</h3>
            <div className="space-y-2">
              {data.risk.why_flagged.map((pt, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RECOMMENDED ACTIONS */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">RECOMMENDED SECURITY ACTIONS</h3>
            <div className="space-y-2">
              {data.risk.recommended_actions.map((act, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs font-bold text-slate-900 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
