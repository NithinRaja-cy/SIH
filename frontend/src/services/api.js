import axios from 'axios';

const API_BASE = '/api';

export const analyzeAudioFile = async (file, sessionId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (sessionId) {
    formData.append('session_id', sessionId);
  }
  const response = await axios.post(`${API_BASE}/analyze-audio`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const uploadReferenceVoice = async (file, name = 'Target Baseline Profile') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('reference_name', name);
  const response = await axios.post(`${API_BASE}/upload-reference-voice`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const fetchSessionAnalysis = async (sessionId) => {
  const response = await axios.get(`${API_BASE}/analysis/${sessionId}`);
  return response.data;
};

export const getPdfReportUrl = (sessionId) => {
  return `${API_BASE}/report/${sessionId}?format=pdf`;
};

export const getJsonReportUrl = (sessionId) => {
  return `${API_BASE}/report/${sessionId}?format=json`;
};
