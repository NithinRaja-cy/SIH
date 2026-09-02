import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, CheckCircle, AlertCircle, FileCheck, RefreshCw, Music, HardDrive, Clock, Sliders } from 'lucide-react';

export default function AudioVerificationShowcase({ file, audioUrl, onConfirmAnalysis, isVerified, setIsVerified }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [file, audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const fileSizeMB = file ? (file.size / (1024 * 1024)).toFixed(2) : '0.45';

  return (
    <div className="light-card p-6 mb-6 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-white border-2 border-blue-200 rounded-2xl shadow-md">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900">AUDIO VERIFICATION SHOWCASE</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-blue-100 text-blue-800 rounded-full border border-blue-300">
                DOUBLE-VERIFY INPUT
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Verify audio fidelity, metadata, and playback before initiating 4 parallel analysis modules</p>
          </div>
        </div>

        {/* Verification Status Badge */}
        <div className="flex items-center space-x-2">
          {isVerified ? (
            <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>✓ AUDIO VERIFIED CORRECT</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>VERIFICATION PENDING</span>
            </span>
          )}
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
        
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <Music className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="truncate">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">FILE NAME</span>
            <span className="text-xs font-extrabold text-slate-800 truncate block">{file ? file.name : 'recorded_sample.wav'}</span>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <HardDrive className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">FILE SIZE</span>
            <span className="text-xs font-extrabold text-slate-800">{fileSizeMB} MB</span>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <Clock className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">DURATION</span>
            <span className="text-xs font-extrabold text-slate-800">{formatTime(duration || 2.15)}</span>
          </div>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3">
          <Sliders className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">SAMPLE RATE</span>
            <span className="text-xs font-extrabold text-slate-800">16 kHz Mono</span>
          </div>
        </div>

      </div>

      {/* HTML5 Audio Player & Visualizer */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 mb-5">
        <audio
          ref={audioRef}
          src={audioUrl || (file ? URL.createObjectURL(file) : '')}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md shrink-0"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Timeline Scrubber */}
          <div className="flex-1 space-y-1">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.01"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Mute Button */}
          <button onClick={toggleMute} className="p-2 text-slate-500 hover:text-slate-800">
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Verification Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-600 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Confirm audio clarity before running 4 parallel analysis modules</span>
        </div>

        <button
          onClick={() => {
            setIsVerified(true);
            if (onConfirmAnalysis && file) {
              onConfirmAnalysis(file);
            }
          }}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center space-x-2 ${
            isVerified
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isVerified ? '✓ AUDIO CONFIRMED & VERIFIED' : 'VERIFY AUDIO & RUN PARALLEL ANALYSIS'}</span>
        </button>
      </div>

    </div>
  );
}
