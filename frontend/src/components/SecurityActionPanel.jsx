import React from 'react';
import { ShieldAlert, Download, PhoneCall, Lock, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { getPdfReportUrl, getJsonReportUrl } from '../services/api';

export default function SecurityActionPanel({ risk, sessionId = 'VIVA-2026-001' }) {
  const level = risk?.risk_level ?? 'HIGH';
  const actions = risk?.recommended_actions ?? [
    "BLOCK SENSITIVE ACTIONS & PAUSE TRANSACTION AUTHORIZATIONS",
    "Require secondary out-of-band identity verification (SMS/Authenticator)",
    "Ask challenge-response security question requiring unscripted memory",
    "Log forensic incident and notify security operations center (SOC)"
  ];

  const pdfUrl = getPdfReportUrl(sessionId);
  const jsonUrl = getJsonReportUrl(sessionId);

  return (
    <div className="light-card p-6 mb-8 border-l-4 border-l-rose-600">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
              AUTOMATED SECURITY PREVENTION ACTIONS
            </h3>
            <p className="text-xs text-slate-500">SOC threat response protocols and incident export controls</p>
          </div>
        </div>

        {/* Report Export Buttons */}
        <div className="flex items-center space-x-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT PDF REPORT</span>
          </a>

          <a
            href={jsonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <FileText className="w-4 h-4" />
            <span>JSON EXPORT</span>
          </a>
        </div>
      </div>

      {/* Protocol Checklist */}
      <div className="space-y-2 mb-6">
        {actions.map((act, idx) => (
          <div key={idx} className="flex items-center space-x-3 p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs font-bold text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{act}</span>
          </div>
        ))}
      </div>

      {/* Interactive Cyber SOC Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
        <button 
          onClick={() => alert(`SOC Action Triggered: Transaction hold enforced for session ${sessionId}.`)}
          className="flex items-center justify-center space-x-2 p-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          <Lock className="w-4 h-4 text-rose-400" />
          <span>PAUSE TRANSACTION</span>
        </button>

        <button 
          onClick={() => alert(`Secondary Auth Challenge dispatched via out-of-band channel.`)}
          className="flex items-center justify-center space-x-2 p-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          <PhoneCall className="w-4 h-4 text-blue-600" />
          <span>OUT-OF-BAND CALLBACK</span>
        </button>

        <button 
          onClick={() => alert(`Incident ${sessionId} dispatched to Security Operations Center.`)}
          className="flex items-center justify-center space-x-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>LOG SOC INCIDENT</span>
        </button>
      </div>
    </div>
  );
}
