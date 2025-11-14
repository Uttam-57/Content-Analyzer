import React, { useState } from 'react';
import './Upload.css';
import { UploadCloud, Type, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function Upload() {
  const [mode, setMode] = useState('file');
  const [dragActive, setDragActive] = useState(false);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | uploading | done | error
  const [response, setResponse] = useState(null);

  const switchMode = (newMode) => {
    setMode(newMode);
    setResponse(null);
    setStatus('idle');
  };

  // ---------- FILE UPLOAD ----------
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (selectedFile) => {
    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log('📥 FILE RESPONSE:', data);
      setResponse(data);
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  // ---------- TEXT UPLOAD ----------
  const uploadText = async () => {
    if (!text.trim()) return alert('Please enter some text');
    setStatus('uploading');

    try {
      const res = await fetch('http://localhost:4000/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      console.log('📥 TEXT RESPONSE:', data);
      setResponse(data);
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">Social Media Content Analyzer</h1>
      <p className="upload-subtitle">Analyze, Improve, Engage Better</p>

      {/* MODE SWITCH */}
      <div className="mode-switch">
        <button
          className={mode === 'file' ? 'active' : ''}
          onClick={() => switchMode('file')}
        >
          <UploadCloud size={16} /> File Upload
        </button>
        <button
          className={mode === 'text' ? 'active' : ''}
          onClick={() => switchMode('text')}
        >
          <Type size={16} /> Text Input
        </button>
      </div>

      {/* MAIN AREA */}
      {mode === 'file' ? (
        <>
          <div
            className={`upload-box ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadCloud className="upload-icon" size={48} />
            <p>Drag & Drop File Here</p>
            <span className="upload-or">or</span>
            <label className="upload-btn">
              Choose File
              <input type="file" onChange={handleChange} hidden />
            </label>
          </div>
          <p className="upload-footer">Supported: PDF, PNG, JPG</p>
        </>
      ) : (
        <div className="text-upload-box">
          <Type className="upload-icon" size={48} />
          <p>Paste or Type Your Post Below</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing your social media content here..."
          />
          <button
            className="upload-btn"
            onClick={uploadText}
            disabled={status === 'uploading'}
          >
            {status === 'uploading' ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>
      )}

      {/* LOADER / STATUS */}
      {status === 'uploading' && (
        <div className="loader-box">
          <Loader2 className="loader-icon" size={32} />
          <p className="loader-text">Analyzing content... please wait</p>
        </div>
      )}

      {status === 'error' && (
        <p className="error-msg">
          <AlertTriangle color="red" size={18} /> Something went wrong
        </p>
      )}

      {/* DISPLAY RESULTS */}
      {response && response.success && status === 'done' && (
        <div className="result-card">
          <h3>
            <CheckCircle color="green" size={18} /> Analysis Complete
          </h3>

          {response.extractedText && (
            <div className="result-section">
              <h4>Extracted Text</h4>
              <p className="result-text">{response.extractedText}</p>
            </div>
          )}

          {response.suggestion && (
            <div className="result-section">
              <h4>Improvement Suggestions</h4>

              {response.suggestion.summary && (
                <p>
                  <strong>Summary:</strong> {response.suggestion.summary}
                </p>
              )}

              {response.suggestion.tone && (
                <p>
                  <strong>Tone:</strong> {response.suggestion.tone}
                </p>
              )}

              {response.suggestion.confidence && (
                <p>
                  <strong>Confidence:</strong>{' '}
                  {(response.suggestion.confidence * 100).toFixed(1)}%
                </p>
              )}

              {Array.isArray(response.suggestion.suggestions) &&
                response.suggestion.suggestions.length > 0 && (
                  <ul className="suggestion-list">
                    {response.suggestion.suggestions.map((s, i) => (
                      <li key={i}>✅ {s}</li>
                    ))}
                  </ul>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
