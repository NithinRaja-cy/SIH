import React from 'react';
import { Shield, Radio, Activity, CheckCircle, FileText } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">VIVA</span>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  CYBER DEFENSE PLATFORM
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Voice Integrity & Verification Architecture • Real-Time AI Voice Cloning Prevention
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>LIVE SYSTEM OPERATIONAL</span>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-t border-slate-100 pt-2">
          {[
            { id: 'home', label: 'Overview & Architecture', icon: Activity },
            { id: 'live', label: 'Live Analysis Dashboard', icon: Radio },
            { id: 'results', label: 'Results & Audit Summary', icon: CheckCircle },
            { id: 'reports', label: 'Forensic Reports', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
