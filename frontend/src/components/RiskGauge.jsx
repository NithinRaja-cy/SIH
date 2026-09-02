import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, Radio } from 'lucide-react';

export default function RiskGauge({ risk }) {
  const hasResult = risk && typeof risk.risk_score === 'number';

  const score = hasResult ? risk.risk_score : 0;
  const level = hasResult ? risk.risk_level : 'STANDBY';
  const decision = hasResult ? risk.final_decision : 'AWAITING AUDIO INPUT & VERIFICATION';

  // Determine theme colors based on risk tier
  let ringColor = 'stroke-slate-300';
  let bgBadge = 'bg-slate-100 text-slate-700 border-slate-300';
  let bannerBg = 'bg-slate-50 border-slate-200 text-slate-700';
  let Icon = Radio;

  if (hasResult) {
    if (level === 'LOW') {
      ringColor = 'stroke-emerald-600';
      bgBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      bannerBg = 'bg-emerald-50 border-emerald-200 text-emerald-900';
      Icon = ShieldCheck;
    } else if (level === 'MEDIUM') {
      ringColor = 'stroke-amber-500';
      bgBadge = 'bg-amber-100 text-amber-800 border-amber-200';
      bannerBg = 'bg-amber-50 border-amber-200 text-amber-900';
      Icon = AlertTriangle;
    } else {
      ringColor = 'stroke-rose-600';
      bgBadge = 'bg-rose-100 text-rose-800 border-rose-200';
      bannerBg = 'bg-rose-50 border-rose-200 text-rose-900';
      Icon = ShieldAlert;
    }
  }

  // SVG Gauge calculations
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="light-card p-6 mb-8 bg-white flex flex-col md:flex-row items-center justify-between gap-6 border-l-8 border-l-blue-600">
      
      {/* Left: Score Gauge Radial */}
      <div className="flex items-center space-x-6">
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-slate-100"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`${ringColor} transition-all duration-700 ease-out`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-slate-900 leading-none">{hasResult ? score : '0'}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">/ 100</span>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">DYNAMIC RISK SCORE</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${bgBadge}`}>
              {hasResult ? `${level} RISK (0-100)` : 'READY - AWAITING AUDIO'}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            IMPERSONATION THREAT LEVEL: <span className={hasResult && level === 'HIGH' ? 'text-rose-600' : 'text-slate-600'}>{hasResult ? level : 'STANDBY'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Formula: Deepfake (40%) + Spectral (25%) + Prosodic (15%) + Speaker Risk (20%)
          </p>
        </div>
      </div>

      {/* Right: Decision Banner */}
      <div className={`flex-1 p-4 rounded-xl border flex items-center space-x-4 ${bannerBg} shadow-sm max-w-lg w-full`}>
        <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center shrink-0 shadow-sm">
          <Icon className={`w-7 h-7 ${hasResult && level === 'HIGH' ? 'text-rose-600 animate-pulse' : 'text-blue-600'}`} />
        </div>
        <div>
          <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-75">AUTOMATED VERDICT DECISION</span>
          <h4 className="text-sm font-extrabold leading-snug tracking-tight">
            {decision}
          </h4>
        </div>
      </div>

    </div>
  );
}
