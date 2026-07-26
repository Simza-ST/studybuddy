import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import { useRef, useState } from 'react';
import { apiClient } from '../../api/client';

const ACCEPTED = ['.pdf', '.docx', '.txt', 'image/*'];
const FORMAT_INFO = [
  { ext: 'PDF', color: 'badge-red',    icon: '📄', desc: 'Lecture notes, textbooks' },
  { ext: 'DOCX', color: 'badge-blue',  icon: '📝', desc: 'Word documents, essays' },
  { ext: 'TXT', color: 'badge-slate',  icon: '📃', desc: 'Plain text notes' },
  { ext: 'Image', color: 'badge-purple', icon: '🖼️', desc: 'Diagrams, slides' },
];

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const applyFile = (f: File) => {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) applyFile(f);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) applyFile(f);
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !file) {
      setStatus({ type: 'error', msg: 'Please add a title and choose a file.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('file', file);
      await apiClient.uploadMaterial(fd);
      setStatus({ type: 'success', msg: '✅ Material uploaded! AI is generating quiz questions in the background.' });
      setTitle('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setStatus({ type: 'error', msg: '❌ Upload failed. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (b: number) =>
    b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main upload form */}
      <div className="card p-8 fade-up">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Upload Study Material</h2>
          <p className="text-sm text-slate-400 mt-1">
            Upload a document or image and our AI will automatically generate quiz questions.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          {status && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                status.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {status.msg}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Material Title <span className="text-red-400">*</span>
            </label>
            <input
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 3 — Photosynthesis"
            />
          </div>

          {/* Drop zone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              File <span className="text-red-400">*</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
                dragging
                  ? 'border-blue-400 bg-blue-50'
                  : file
                  ? 'border-emerald-300 bg-emerald-50'
                  : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED.join(',')}
                onChange={handleFileChange}
                className="sr-only"
              />
              {file ? (
                <div className="space-y-2">
                  <p className="text-3xl">✅</p>
                  <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="text-xs text-red-500 hover:text-red-600 font-medium underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-4xl">📂</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {dragging ? 'Drop it here!' : 'Drag & drop or click to browse'}
                  </p>
                  <p className="text-xs text-slate-400">PDF, DOCX, TXT, or image — max 50 MB</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Uploading…
              </span>
            ) : (
              '🚀 Upload & Generate Quiz'
            )}
          </button>
        </form>
      </div>

      {/* Sidebar info */}
      <div className="space-y-5">
        {/* Supported formats */}
        <div className="card p-6 fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Supported Formats</p>
          <div className="space-y-3">
            {FORMAT_INFO.map((f) => (
              <div key={f.ext} className="flex items-center gap-3">
                <span className="text-xl">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${f.color}`}>{f.ext}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="card p-6 fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">How It Works</p>
          <ol className="space-y-4">
            {[
              { step: '1', text: 'Upload your study material' },
              { step: '2', text: 'AI parses and extracts key concepts' },
              { step: '3', text: 'Quiz questions are generated automatically' },
              { step: '4', text: 'Start a quiz session from the Quiz Center' },
            ].map((s) => (
              <li key={s.step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {s.step}
                </span>
                <span className="text-sm text-slate-600">{s.text}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* AI badge */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-blue-900 p-6 text-white fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-2">Powered by</p>
          <p className="text-lg font-bold">Gemini 1.5 Flash</p>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Google's latest AI model generates MCQ, short-answer, and long-answer questions tailored to your material.
          </p>
        </div>
      </div>
    </div>
  );
}
