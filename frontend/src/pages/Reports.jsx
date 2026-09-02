import React from 'react';
import { FileText, Download, ShieldAlert, ShieldCheck, Eye, Search } from 'lucide-react';
import { getPdfReportUrl, getJsonReportUrl } from '../services/api';

export default function Reports({ currentSessionData }) {
  const sessions = [
    {
      id: currentSessionData?.session_id || 'VIVA-2026-001',
      date: currentSessionData?.timestamp || '2026-09-02 21:15:00',
      duration: `${currentSessionData?.duration_seconds || 2.15}s`,
      riskScore: currentSessionData?.risk?.risk_score || 87,
      riskLevel: currentSessionData?.risk?.risk_level || 'HIGH',
      decision: currentSessionData?.risk?.final_decision || 'POSSIBLE AI VOICE CLONING IMPERSONATION ATTACK',
      speakerMatch: `${currentSessionData?.speaker?.speaker_similarity || 84}%`,
      syntheticProb: `${currentSessionData?.deepfake?.synthetic_probability || 88}%`
    },
    {
      id: 'VIVA-2026-002',
      date: '2026-09-02 20:45:12',
      duration: '2.10s',
      riskScore: 14,
      riskLevel: 'LOW',
      decision: 'AUTHENTIC SPEECH VERIFIED (LOW RISK)',
      speakerMatch: '91%',
      syntheticProb: '9%'
    },
    {
      id: 'VIVA-2026-003',
      date: '2026-09-02 19:30:05',
      duration: '2.00s',
      riskScore: 91,
      riskLevel: 'HIGH',
      decision: 'POSSIBLE AI VOICE CLONING IMPERSONATION ATTACK',
      speakerMatch: '86%',
      syntheticProb: '92%'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">FORENSIC SECURITY REPORTS</h1>
          <p className="text-xs text-slate-500">Audit repository of past audio session evaluations and PDF incident logs</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Session ID..."
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium w-64 shadow-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Session Table */}
      <div className="light-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Session ID</th>
                <th className="py-3.5 px-4">Date / Time</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Synthetic %</th>
                <th className="py-3.5 px-4">Speaker Match</th>
                <th className="py-3.5 px-4">Risk Score</th>
                <th className="py-3.5 px-4">Verdict</th>
                <th className="py-3.5 px-4 text-right">Download Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {sessions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-blue-600">{item.id}</td>
                  <td className="py-4 px-4 text-slate-500">{item.date}</td>
                  <td className="py-4 px-4">{item.duration}</td>
                  <td className="py-4 px-4 font-bold text-purple-700">{item.syntheticProb}</td>
                  <td className="py-4 px-4 font-bold text-emerald-700">{item.speakerMatch}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-black ${
                      item.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.riskScore} / 100
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-900 max-w-xs truncate">{item.decision}</td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <a
                      href={getPdfReportUrl(item.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md font-bold hover:bg-blue-100 border border-blue-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                    <a
                      href={getJsonReportUrl(item.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-md font-bold hover:bg-slate-200 border border-slate-200 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>JSON</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
