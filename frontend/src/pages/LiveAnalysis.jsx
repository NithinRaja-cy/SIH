import React from 'react';
import AudioInput from '../components/AudioInput';
import PreprocessingStatus from '../components/PreprocessingStatus';
import ParallelAnalysisCards from '../components/ParallelAnalysisCards';
import RiskGauge from '../components/RiskGauge';
import RiskTimeline from '../components/RiskTimeline';
import ExplanationPanel from '../components/ExplanationPanel';
import SecurityActionPanel from '../components/SecurityActionPanel';

export default function LiveAnalysis({ analysisData, onAnalyzeFile, isProcessing, setReferenceVoiceStatus }) {
  const prepStatus = analysisData?.preprocessing;
  const spectral = analysisData?.spectral;
  const prosodic = analysisData?.prosodic;
  const deepfake = analysisData?.deepfake;
  const speaker = analysisData?.speaker;
  const risk = analysisData?.risk;
  const timeline = analysisData?.timeline;
  const sessionId = analysisData?.session_id || 'VIVA-2026-001';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. Voice Input Layer */}
      <AudioInput 
        onAnalyzeFile={onAnalyzeFile} 
        setReferenceVoiceStatus={setReferenceVoiceStatus}
      />

      {/* 2. Audio Preprocessing Status Bar */}
      <PreprocessingStatus status={prepStatus} duration={analysisData?.duration_seconds || 2.0} />

      {/* 3. Dynamic Risk Score Gauge & Decision Banner */}
      <RiskGauge risk={risk} />

      {/* 4. THE 4 PARALLEL ANALYSIS CARDS (Spectral, Prosodic, Deepfake, Speaker) */}
      <ParallelAnalysisCards 
        spectral={spectral}
        prosodic={prosodic}
        deepfake={deepfake}
        speaker={speaker}
        isProcessing={isProcessing}
      />

      {/* 5. Live Risk Timeline & AI Explanation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskTimeline timeline={timeline} />
        <ExplanationPanel whyFlagged={risk?.why_flagged} aiExplanation={risk?.ai_explanation} />
      </div>

      {/* 6. Security Prevention Actions & Report Exports */}
      <SecurityActionPanel risk={risk} sessionId={sessionId} />

    </div>
  );
}
