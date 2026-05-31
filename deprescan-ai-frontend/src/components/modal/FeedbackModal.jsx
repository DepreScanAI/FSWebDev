import { useState } from 'react';
import PropTypes from 'prop-types';
import { feedbackAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function FeedbackModal({ sessionId, onClose, onFeedbackSent }) {
  const [isHelpful, setIsHelpful] = useState(null);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (isHelpful === null) return;
    setLoading(true);
    setErr('');
    try {
      await feedbackAPI.create({
        session_id: sessionId || null,
        is_helpful: isHelpful,
        name_label: name.trim() || user?.name || null,
      });
      setSubmitted(true);

      onFeedbackSent?.(sessionId);
    } catch (e) {
      const status = e.response?.status;
      if (status === 401) {
        setErr('Sesi login habis. Silakan login ulang.');
      } else if (status === 409) {
        setErr('');
        setSubmitted(true);
        onFeedbackSent?.(sessionId);
      } else {
        setErr(
          e.response?.data?.message || 'Gagal mengirim feedback. Coba lagi.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-2xl p-5 md:p-8 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {!submitted ? (
          <>
            <h3 className="font-serif text-xl md:text-2xl text-white mb-2">
              Apakah hasil ini membantu?
            </h3>
            <p className="text-gray-400 text-xs mb-6">
              Pilih salah satu untuk melanjutkan atau klik di luar konten untuk
              melewati
            </p>

            {/* Tombol feedback — berdampingan di sm+, stack di mobile kecil */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {[
                [true, '👍', 'Ya', 'border-white text-white'],
                [false, '👎', 'Tidak', 'border-white text-white'],
              ].map(([val, emoji, label, activeClass]) => (
                <button
                  key={label}
                  onClick={() => setIsHelpful(val)}
                  className={`flex-1 py-4 md:py-5 rounded-xl text-base font-semibold border-2 transition-colors flex flex-col items-center gap-2 ${
                    isHelpful === val
                      ? activeClass
                      : 'bg-transparent border-gray-600 text-gray-300 hover:border-gray-400'
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  {label}
                </button>
              ))}
            </div>

            {err && (
              <div className="mb-3 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-xs">
                {err}
              </div>
            )}

            <div className="mb-5">
              <label className="text-gray-400 text-sm font-semibold mb-2 block">
                Masukkan Nama (Opsional)
              </label>
              {/* Input + tombol kirim — stack di mobile, berdampingan di sm+ */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Boleh dikosongkan — otomatis anonim"
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white text-sm outline-none focus:border-brand-400"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isHelpful === null || loading}
                  className="px-5 py-3 rounded-xl bg-white text-gray-900 font-bold text-sm disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  {loading ? '...' : 'Kirim'}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-500 text-xs hover:text-gray-300 transition-colors"
            >
              Lewati feedback
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🙏</div>
            <h3 className="font-serif text-xl text-white mb-2">
              Terima kasih!
            </h3>
            <p className="text-gray-400 text-sm">
              Feedback Anda membantu kami meningkatkan DepreScan.
            </p>
            <button
              onClick={onClose}
              className="mt-6 btn-primary px-8 py-2.5 rounded-xl"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

FeedbackModal.propTypes = {
  sessionId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onFeedbackSent: PropTypes.func,
};
