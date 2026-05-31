import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { screeningAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDateTimeID } from '../utils/helpers';

import ScoreHero from '../components/chart/ScoreHero';
import ScoreInterpretasi from '../components/chart/ScoreInterpretasi';
import AIInsight from '../components/chart/AIInsight';
import Brain3D from '../components/chart/Brain3D';
import LifestyleRadar from '../components/chart/LifestyleRadar';
import KonsensusModel from '../components/chart/KonsensusModel';
import ModelResultsTable from '../components/chart/ModelResultsTable';
import CompareModels from '../components/chart/CompareModels';
import FaktorRisiko from '../components/chart/FaktorRisiko';

import FeedbackModal from '../components/modal/FeedbackModal';

const feedbackKey = (sid) => `deprescan_feedback_sent_${sid}`;

const n = (v, fallback = 0) => {
  const p = parseFloat(v);
  return isNaN(p) ? fallback : p;
};

export default function Hasil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [toast, setToast] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const hasRun = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (hasRun.current) return;
    hasRun.current = true;

    if (!id) {
      // Tidak ada id pada halaman hasil, redirect ke screening
      navigate('/screening', { replace: true });
      return;
    }

    if (!user) {
      navigate(`/login?redirect=/hasil/${id}`, { replace: true });
      return;
    }

    screeningAPI
      .getSessionByCode(id)
      .then((res) => {
        const s = res.data.data.session;
        setResult({
          prediction: {
            phq_score: n(s.phq_score),
            phq_score_int: n(s.phq_score_int),
            category: s.category,
            confidence_band: s.confidence_band,
            disclaimer: s.disclaimer,
            ai_insight: s.ai_insight,
          },
          input_data: s.input_data || {},
          name_label: s.name_label,
          session_id: s.id,
          created_at: s.created_at,
        });
        if (localStorage.getItem(feedbackKey(s.id))) {
          setFeedbackSent(true);
        }

        const justFinished = sessionStorage.getItem('deprescan_just_finished');
        if (justFinished === s.session_code) {
          sessionStorage.removeItem('deprescan_just_finished');
          setToast(true);
          setTimeout(() => setToast(false), 3500);
        }
      })
      .catch(() => navigate('/riwayat'))
      .finally(() => setLoading(false));
  }, [id, user, authLoading, navigate]);

  useEffect(() => {
    hasRun.current = false;
    setLoading(true);
    setResult(null);
    setFeedbackSent(false);
  }, [id]);

  const handleFeedbackSent = (sessionId) => {
    if (sessionId) localStorage.setItem(feedbackKey(sessionId), '1');
    setFeedbackSent(true);
    setShowFeedback(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-gray-500 text-sm">
            Memuat hasil prediksi...
          </p>
        </div>
      </div>
    );
  }
  if (!result) return null;

  const { prediction, input_data, name_label, session_id, created_at } = result;
  const score = n(prediction.phq_score);
  const dateLabel = created_at
    ? formatDateTimeID(created_at)
    : new Date().toLocaleDateString('id-ID');

  return (
    // header profil user dan tanggal sesi screening
    <div className="min-h-screen bg-bg pb-16">
      <div className="max-w-screen-lg mx-auto px-4 pt-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="font-serif text-3xl text-black">Hasil Prediksi</h1>
            <p className="text-gray-500 text-sm mt-1">{dateLabel}</p>
          </div>
          {user && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-7 h-7 rounded-full border border-brand-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
              <span>{name_label || user.name}</span>
            </div>
          )}
        </div>

        {/* bagian-bagian chart */}

        <ScoreHero prediction={prediction} />
        <ScoreInterpretasi prediction={prediction} />
        <AIInsight
          insight={prediction.ai_insight}
          sessionId={session_id}
          onInsightActivated={(newInsight) =>
            setResult((prev) => ({
              ...prev,
              prediction: { ...prev.prediction, ai_insight: newInsight },
            }))
          }
        />
        <Brain3D inputData={input_data} phqScore={score} />
        <LifestyleRadar inputData={input_data} />
        <KonsensusModel 
          phqScore={score} 
          activeCategory={prediction.category} 
        />
        <ModelResultsTable
          phqScore={score}
          activeCategory={prediction.category}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <CompareModels
            phqScore={score}
            activeCategory={prediction.category}
          />
          <FaktorRisiko inputData={input_data} phqScore={score} />
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-8 leading-relaxed">
          <strong>Disclaimer:</strong> Hasil ini adalah indikasi awal
          berdasarkan skrining PHQ-9, bukan diagnosis klinis. Selalu
          konsultasikan kondisi Anda dengan profesional kesehatan mental.
        </div>

        {/* Navigasi dan tombol */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate('/screening')}
            className="btn-secondary px-6 py-3 rounded-xl flex items-center gap-2"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Ulangi Screening
          </button>

          {feedbackSent ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Feedback Terkirim
            </div>
          ) : (
            <button
              onClick={() => setShowFeedback(true)}
              className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
            >
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Beri Feedback
            </button>
          )}

          {user && (
            <button
              onClick={() => navigate('/riwayat')}
              className="btn-secondary px-6 py-3 rounded-xl flex items-center gap-2"
            >
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Lihat di Riwayat
            </button>
          )}
        </div>
      </div>

      {showFeedback && (
        <FeedbackModal
          sessionId={session_id}
          onClose={() => setShowFeedback(false)}
          onFeedbackSent={handleFeedbackSent}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-brand-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Prediksi selesai & tersimpan ke riwayat!
          </div>
        </div>
      )}
    </div>
  );
}
