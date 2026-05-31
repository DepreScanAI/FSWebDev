import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import AuthLayout from '../components/auth/AuthLayout';

const ArrowLeftIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

/* Content kanan */
const StepsRight = () => (
  <div className="flex flex-col gap-3">
    {[
      ['1', 'Masukkan email terdaftar'],
      ['2', 'Cek link di email kamu'],
      ['3', 'Buat password baru'],
    ].map(([num, text]) => (
      <div key={num} className="flex items-center gap-3">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-xs font-bold text-white">
          {num}
        </div>
        <span className="text-white/85 text-sm">{text}</span>
      </div>
    ))}
  </div>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      rightTitle={`Jangan khawatir,\nkami bantu kamu`}
      rightSubtitle="Lupa Password"
      rightDesc="Keamanan akun user adalah prioritas kami. Proses reset password mudah dan aman cukup beberapa langkah saja."
      rightExtra={<StepsRight />}
    >
      {!submitted ? (
        <>
          {/* Back link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 hover:opacity-70 transition-opacity mb-6"
          >
            <ArrowLeftIcon />
            Kembali ke Login
          </Link>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="font-serif text-2xl text-gray-800 mb-2">
              Lupa Password?
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Masukkan email yang terdaftar. Kami akan mengirimkan link untuk
              mereset password kamu.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                required
                autoComplete="email"
                className="input-field"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl"
            >
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Link reset password berlaku selama{' '}
            <span className="font-semibold">1 jam</span> setelah dikirim.
          </p>
        </>
      ) : (
        /* state sukses */
        <div className="flex flex-col items-center justify-center text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-brand-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-gray-800 mb-2">
            Email Terkirim!
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-1">
            Jika email{' '}
            <span className="font-semibold text-gray-700">{email}</span>{' '}
            terdaftar di DepreScan, kami akan mengirimkan link reset password.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Cek folder <em>spam</em> jika tidak muncul dalam beberapa menit.
            Link berlaku <span className="font-semibold">1 jam</span>.
          </p>
          <Link
            to="/login"
            className="btn-primary px-6 py-2.5 rounded-xl text-sm"
          >
            Kembali ke Login
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}
