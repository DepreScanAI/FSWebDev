import { useState } from 'react';
import ChartLabel from '../label/ChartLabel';
import PropTypes from 'prop-types';
import { screeningAPI } from '../../services/api';

export default function AIInsight({ insight, sessionId, onInsightActivated }) {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleActivate = async () => {
    if (!sessionId) return;
    setLoading(true);
    setLocalError('');
    try {
      const res = await screeningAPI.requestAiInsight(sessionId);
      const aiInsight = res.data.data.ai_insight;
      if (onInsightActivated) onInsightActivated(aiInsight);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Gagal mengaktifkan AI Insight.';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Jika insight sudah ada, tampilkan konten
  if (insight) {
    return (
      <div className="card p-6 mb-6">
        <ChartLabel>Rekomendasi AI</ChartLabel>
        <p className="text-xs text-gray-400 mb-4">
          Interpretasi dan rekomendasi personal berdasarkan data screening Anda
          via Groq AI.
        </p>
        <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {insight}
        </div>
      </div>
    );
  }

  // Jika insight belum ada dan ada sessionId, tampilkan opsi aktivasi
  if (!insight && sessionId) {
    return (
      <div className="card p-6 mb-6">
        <ChartLabel>Rekomendasi AI</ChartLabel>
        <p className="text-xs text-gray-400 mb-4">
          Interpretasi dan rekomendasi personal berdasarkan data screening Anda
          via Groq AI.
        </p>
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl w-full">
            <svg
              className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs text-gray-500 leading-relaxed">
              AI Insight tidak diaktifkan saat screening. Klik tombol di bawah
              untuk meminta analisis rekomendasi personal dari Groq AI.
            </p>
          </div>
          {localError && (
            <p className="text-xs text-red-500">{localError}</p>
          )}
          <button
            type="button"
            onClick={handleActivate}
            disabled={loading}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Aktifkan AI Insight
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

AIInsight.propTypes = {
  insight: PropTypes.string,
  sessionId: PropTypes.string,
  onInsightActivated: PropTypes.func,
};
