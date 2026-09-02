import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

export default function Home({ onStartAnalysis }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Section */}
      <div className="light-card p-8 md:p-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden shadow-xl rounded-2xl">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>ENTERPRISE AI VOICE SECURITY PLATFORM</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            VIVA – Voice Integrity & Verification Architecture
          </h1>

          <p className="text-lg text-blue-100 font-normal leading-relaxed mb-8">
            Near-real-time AI-powered cyber defense system designed to detect and prevent sophisticated AI voice cloning impersonation attacks across live call audio and transaction channels.
          </p>

          <div>
            <button
              onClick={onStartAnalysis}
              className="px-8 py-4 bg-white text-blue-700 rounded-xl text-sm font-extrabold hover:bg-blue-50 transition-all shadow-lg flex items-center space-x-2"
            >
              <span>LAUNCH LIVE ANALYSIS DASHBOARD</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KEY SECURITY INSIGHT SPOTLIGHT */}
      <div className="light-card p-6 bg-amber-50/60 border-amber-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider block mb-1">
              KEY CYBERSECURITY DIFFERENTIATOR & INSIGHT
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              High Speaker Match Similarity Does NOT Mean Genuine Audio!
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Modern AI neural voice cloners accurately replicate target victim speaker embeddings (yielding <strong>high Cosine Similarity</strong>). Legacy biometric tools pass this as authentic. VIVA executes <strong>4 Parallel Analysis Modules</strong> simultaneously, catching vocoder high-frequency spectral phase artifacts and robotic prosodic perturbations to flag sophisticated cloning attacks.
            </p>
          </div>
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE FLOWCHART */}
      <div className="light-card p-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
            COMPLETE SYSTEM ARCHITECTURE FLOW
          </h2>
          <p className="text-xs text-slate-500">
            End-to-end data pipeline from voice input chunking to 4-module parallel analysis, evidence fusion, dynamic risk scoring, and report generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase">STEP 1</span>
            <h4 className="text-xs font-extrabold text-slate-800 my-2">VOICE INPUT & PRE-PROCESSING</h4>
            <p className="text-[11px] text-slate-500">Live Mic / File Upload. 16kHz mono resampling, peak normalization & 2s window chunking.</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold text-blue-600 uppercase">STEP 2</span>
            <h4 className="text-xs font-extrabold text-blue-900 my-2">4 PARALLEL ENGINES</h4>
            <p className="text-[11px] text-blue-800">Concurrent asyncio.gather: Spectral, Prosodic, Deepfake Classifier & Speaker Verification.</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold text-purple-600 uppercase">STEP 3</span>
            <h4 className="text-xs font-extrabold text-purple-900 my-2">FUSION & DYNAMIC RISK</h4>
            <p className="text-[11px] text-purple-800">Feature evidence fusion & 40/25/15/20 weighted risk score calculation (0–100).</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold text-emerald-600 uppercase">STEP 4</span>
            <h4 className="text-xs font-extrabold text-emerald-900 my-2">XAI & INCIDENT REPORT</h4>
            <p className="text-[11px] text-emerald-800">Itemized evidence explanation, automated security actions, and exportable PDF / JSON report.</p>
          </div>

        </div>
      </div>

    </div>
  );
}
