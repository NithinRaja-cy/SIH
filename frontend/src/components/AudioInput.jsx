import React, { useState, useRef } from 'react';
import { Mic, Upload, Play, Pause, UserCheck, FileAudio } from 'lucide-react';
import { uploadReferenceVoice } from '../services/api';

export default function AudioInput({ onAnalyzeFile, setReferenceVoiceStatus }) {
  const [activeInputMode, setActiveInputMode] = useState('upload'); // 'upload' or 'mic'
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);
  const [refUploadMessage, setRefUploadMessage] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioPreviewRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Handle Main Audio File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onAnalyzeFile(file);
    }
  };

  // Handle Reference Speaker Profile Upload
  const handleReferenceChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setReferenceFile(file);
      try {
        const res = await uploadReferenceVoice(file, 'Victim Speaker Baseline');
        setRefUploadMessage(res.message);
        if (setReferenceVoiceStatus) setReferenceVoiceStatus(true);
      } catch (err) {
        setRefUploadMessage('Failed to extract reference speaker embedding.');
      }
    }
  };

  // Toggle Live Microphone Recording
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          const file = new File([blob], 'mic_recorded_sample.wav', { type: 'audio/wav' });
          setSelectedFile(file);
          onAnalyzeFile(file);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        alert('Microphone access denied or not available.');
      }
    }
  };

  const togglePreview = () => {
    if (!selectedFile) return;
    if (isPlayingPreview) {
      if (audioPreviewRef.current) audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      if (audioPreviewRef.current) audioPreviewRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  return (
    <div className="light-card p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileAudio className="w-5 h-5 text-blue-600" />
            <span>VOICE INPUT CONTROL LAYER</span>
          </h2>
          <p className="text-xs text-slate-500">Select input stream source for parallel acoustic analysis</p>
        </div>

        {/* Input Selector Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveInputMode('upload')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeInputMode === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload Audio File
          </button>
          <button
            onClick={() => setActiveInputMode('mic')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeInputMode === 'mic' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Microphone
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Input Controls (2 cols) */}
        <div className="md:col-span-2">
          {activeInputMode === 'upload' && (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
              <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Drag & Drop Audio File (WAV / MP3)</p>
              <p className="text-xs text-slate-400 mb-4">Supports 16kHz mono audio streams</p>
              
              <label className="cursor-pointer inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                <span>Select Audio File</span>
                <input type="file" accept="audio/wav,audio/mp3,audio/m4a" onChange={handleFileChange} className="hidden" />
              </label>

              {selectedFile && (
                <div className="mt-4 flex items-center justify-center space-x-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                  <span className="text-xs font-medium text-slate-700 truncate max-w-xs">{selectedFile.name}</span>
                  <button onClick={togglePreview} className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
                    {isPlayingPreview ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <audio ref={audioPreviewRef} src={URL.createObjectURL(selectedFile)} onEnded={() => setIsPlayingPreview(false)} className="hidden" />
                </div>
              )}
            </div>
          )}

          {activeInputMode === 'mic' && (
            <div className="border border-slate-200 rounded-xl p-6 text-center bg-slate-50/50">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Mic className={`w-8 h-8 ${isRecording ? 'text-rose-600 animate-pulse' : 'text-blue-600'}`} />
              </div>
              <p className="text-sm font-bold text-slate-800">
                {isRecording ? 'RECORDING LIVE AUDIO STREAM...' : 'READY FOR MICROPHONE CAPTURE'}
              </p>
              <p className="text-xs text-slate-500 mb-4">Continuously chunks audio into 2.0 second windows for analysis</p>
              
              <button
                onClick={toggleRecording}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                  isRecording 
                    ? 'bg-rose-600 text-white hover:bg-rose-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isRecording ? 'STOP RECORDING & ANALYZE' : 'START LIVE CAPTURE'}
              </button>
            </div>
          )}
        </div>

        {/* Reference Voice Profile Selector (1 col) */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Reference Speaker Voice</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Upload target victim reference voice to calculate Speaker Similarity Cosine Vector.
            </p>

            <label className="cursor-pointer block text-center bg-white border border-slate-300 hover:border-indigo-500 py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 transition-colors shadow-sm">
              <span>{referenceFile ? referenceFile.name : 'Upload Target Voice Sample'}</span>
              <input type="file" accept="audio/*" onChange={handleReferenceChange} className="hidden" />
            </label>
          </div>

          {refUploadMessage && (
            <div className="mt-3 text-[11px] font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
              ✓ {refUploadMessage}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
