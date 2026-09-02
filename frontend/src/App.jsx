import React, { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import LiveAnalysis from './pages/LiveAnalysis';
import Results from './pages/Results';
import Reports from './pages/Reports';
import { analyzeAudioFile } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('live'); // Default tab is Live Analysis
  const [analysisData, setAnalysisData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasReferenceVoice, setHasReferenceVoice] = useState(false);

  // Handle Audio File Upload Analysis
  const handleAnalyzeFile = async (file) => {
    setIsProcessing(true);
    try {
      const res = await analyzeAudioFile(file, analysisData?.session_id);
      setAnalysisData(res);
    } catch (err) {
      alert('Failed to process audio file: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page View Content */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <Home
            onStartAnalysis={() => setActiveTab('live')}
          />
        )}

        {activeTab === 'live' && (
          <LiveAnalysis
            analysisData={analysisData}
            onAnalyzeFile={handleAnalyzeFile}
            isProcessing={isProcessing}
            setReferenceVoiceStatus={setHasReferenceVoice}
          />
        )}

        {activeTab === 'results' && (
          <Results analysisData={analysisData} />
        )}

        {activeTab === 'reports' && (
          <Reports currentSessionData={analysisData} />
        )}
      </main>

      {/* Enterprise Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 font-medium">
          <p>© 2026 VIVA – Voice Integrity & Verification Architecture • Production Cyber Defense</p>
        </div>
      </footer>

    </div>
  );
}
