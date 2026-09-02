import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function RiskTimeline({ timeline = [] }) {
  // Default mock timeline if empty
  const defaultData = [
    { chunk: 'Chunk 1', risk: 18, synthetic: 25, spectral: 30, speaker: 84 },
    { chunk: 'Chunk 2', risk: 35, synthetic: 42, spectral: 50, speaker: 84 },
    { chunk: 'Chunk 3', risk: 57, synthetic: 65, spectral: 68, speaker: 84 },
    { chunk: 'Chunk 4', risk: 76, synthetic: 78, spectral: 75, speaker: 84 },
    { chunk: 'Chunk 5', risk: 87, synthetic: 88, spectral: 82, speaker: 84 },
  ];

  const data = timeline.length > 0 ? timeline : defaultData;

  return (
    <div className="light-card p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>LIVE CHUNK RISK TIMELINE ACCUMULATION</span>
          </h3>
          <p className="text-xs text-slate-500">Real-time risk trajectory updated across sequential 2.0s audio windows</p>
        </div>
        
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          Window Progression
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="chunk" stroke="#64748B" fontSize={11} tickLine={false} />
            <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.5rem', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="risk" name="Dynamic Risk Score" stroke="#DC2626" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
            <Line type="monotone" dataKey="synthetic" name="Synthetic Prob %" stroke="#7C3AED" strokeWidth={2} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="spectral" name="Spectral Anomaly" stroke="#2563EB" strokeWidth={2} />
            <Line type="monotone" dataKey="speaker" name="Speaker Similarity %" stroke="#16A34A" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
