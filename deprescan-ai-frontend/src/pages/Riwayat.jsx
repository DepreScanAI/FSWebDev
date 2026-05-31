import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { screeningAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  phqCategory,
  phqCategoryIndonesian,
  formatDateTimeID,
} from '../utils/helpers';

const n = (v, fallback = 0) => {
  const p = parseFloat(v);
  return isNaN(p) ? fallback : p;
};

const gradientForCategory = (cat) =>
  ({
    Minimal: 'from-emerald-50 to-emerald-100',
    Mild: 'from-yellow-50 to-yellow-100',
    Moderate: 'from-orange-50 to-orange-100',
    'Moderately Severe': 'from-red-50 to-red-100',
    Severe: 'from-purple-50 to-purple-100',
  })[cat] ?? 'from-gray-50 to-gray-100';

export default function Riwayat() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  // Cegah 2 kali fetch
  const hasFetched = useRef(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await screeningAPI.getSessions();
      setSessions(
        (res.data.data.sessions ?? []).map((s) => ({
          ...s,
          phq_score: n(s.phq_score),
        })),
      );
    } catch (e) {
      if (e.response?.status === 401)
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, {
          replace: true,
        });
      else setError(e.response?.data?.message || 'Gagal memuat riwayat.');
    } finally {
      setLoading(false);
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, {
        replace: true,
      });
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchSessions();
  }, [authLoading, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    setDeletingId(id);
    try {
      await screeningAPI.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setError('Gagal menghapus sesi.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      await screeningAPI.deleteAllSessions();
      setSessions([]);
      setConfirmDeleteAll(false);
    } catch {
      setError('Gagal menghapus semua sesi.');
    } finally {
      setDeletingAll(false);
    }
  };

  if (authLoading || loading)
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-gray-500">Memuat riwayat...</p>
        </div>
      </div>
    );

  const totalSesi = sessions.length;
  const lastScore = totalSesi > 0 ? sessions[0].phq_score.toFixed(1) : '—';
  const lastCat = totalSesi > 0 ? sessions[0].category : '';
  const lastCatID = totalSesi > 0 ? phqCategoryIndonesian(lastCat) : '—';

  const avgScore =
    totalSesi > 0
      ? (sessions.reduce((s, x) => s + x.phq_score, 0) / totalSesi).toFixed(1)
      : '—';

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-[#0d172f]">
              Riwayat Screening
            </h1>
            <p className="font-serif text-gray-500 text-base mt-1">
              Sesi anda akan tercatat di riwayat screening
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchSessions}
              title="Refresh"
              className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-brand-50 transition-colors"
            >
              <svg
                className="w-4 h-4 text-brand-500"
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
            </button>
            {sessions.length > 0 && (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-300 rounded-xl text-red-500 font-semibold text-sm hover:bg-red-100 transition-colors"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Hapus Semua
              </button>
            )}
          </div>
        </div>

        {/* error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* status */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Sesi', value: totalSesi, color: '#2a4891' },
              { label: 'Skor Terakhir', value: lastScore, color: '#2a4891' },
              { label: 'Kategori Terbaru', value: lastCatID, color: '#2a4891' },
              { label: 'Skor Rata-rata', value: avgScore, color: '#2a4891' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card p-4">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                  {label}
                </p>
                <p className="font-serif text-lg font-normal" style={{ color }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* misal riwayat kosong */}
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-5">
              <svg
                className="w-10 h-10 text-brand-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-gray-500 mb-2">
              Belum ada riwayat screening
            </h3>
            <p className="text-gray-400 text-sm mb-8 max-w-xs leading-relaxed">
              Mulailah screening pertamamu.
            </p>
            <button
              onClick={() => navigate('/screening')}
              className="btn-primary px-10 py-3 rounded-xl"
            >
              Mulai Screening
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session, idx) => {
              const score = session.phq_score;
              const catInfo = phqCategory(score);
              const gradClass = gradientForCategory(session.category);
              const isDeleting = deletingId === session.id;
              return (
                <div
                  key={session.id}
                  className={`rounded-2xl border border-brand-500/30 overflow-hidden bg-gradient-to-r ${gradClass} cursor-pointer hover:shadow-md transition-all group`}
                  onClick={() => navigate(`/riwayat/${session.id}`)}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4">
                    <div
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: catInfo.bg,
                        color: catInfo.color,
                      }}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="min-w-0">
                        <h2
                          className="font-serif text-lg font-normal"
                          style={{ color: catInfo.color }}
                        >
                          {phqCategoryIndonesian(session.category)}
                        </h2>
                        <p className="font-sans text-gray-500 text-xs mt-0.5">
                          {formatDateTimeID(session.created_at)}
                        </p>
                      </div>
                    </div>
                    <div
                      className="px-3 py-1 rounded-lg border text-base font-serif font-semibold flex-shrink-0"
                      style={{
                        backgroundColor: catInfo.bg,
                        borderColor: catInfo.color,
                        color: catInfo.color,
                      }}
                    >
                      {score.toFixed(1)}
                    </div>
                    <div className="hidden sm:flex flex-col gap-1 w-24 flex-shrink-0">
                      <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${(score / 27) * 100}%`,
                            backgroundColor: catInfo.color,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 text-right">
                        {((score / 27) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-2 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => navigate(`/riwayat/${session.id}`)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/70 hover:bg-white text-brand-500 font-semibold text-xs transition-colors border border-brand-200 group-hover:border-brand-400"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Detail
                      </button>
                      <button
                        onClick={(e) => handleDelete(session.id, e)}
                        disabled={isDeleting}
                        className="p-2 rounded-xl bg-white/70 hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors border border-transparent hover:border-red-200 disabled:opacity-40"
                      >
                        {isDeleting ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* tombol delet semua riwayat */}
      {confirmDeleteAll && (
        <div
          className="modal-backdrop"
          onClick={() => setConfirmDeleteAll(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl mb-2 text-center">
              Hapus Semua Riwayat?
            </h3>
            <p className="text-gray-500 text-sm mb-6 text-center">
              Tindakan ini tidak bisa dibatalkan. Semua{' '}
              <strong>{sessions.length} sesi</strong> akan dihapus permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="flex-1 btn-secondary py-2.5 rounded-xl text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deletingAll}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deletingAll ? 'Menghapus...' : 'Hapus Semua'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
