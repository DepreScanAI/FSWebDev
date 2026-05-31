import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import AuthLayout from '../components/auth/AuthLayout';
import PropTypes from 'prop-types';

const EyeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const EyeOffIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);

/* rekomendasi tingkat password  */
const getStrength = (p) => {
  if (!p) return null;
  let score = 0;
  if (p.length >= 6) score++;
  if (p.length >= 10) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  if (score <= 1) return { level: 1, label: 'Lemah', bar: 'bg-red-400' };
  if (score <= 3) return { level: 2, label: 'Sedang', bar: 'bg-amber-400' };
  return { level: 3, label: 'Kuat', bar: 'bg-green-500' };
};

/* content tips kanan */
const TipsRight = () => (
  <div className="flex flex-col gap-2.5 text-white/70">
    {[
      'Minimal 6 karakter',
      'Kombinasi huruf besar & kecil',
      'Tambahkan angka atau simbol',
      'Jangan gunakan password lama',
    ].map((tip, i) => (
      <div key={i} className="flex items-start gap-2.5">
        <svg
          className="w-4 h-4 flex-shrink-0 mt-0.5 text-white/70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-white/82 text-sm">{tip}</span>
      </div>
    ))}
  </div>
);

/* rusable password input */
function PasswordInput({ value, onChange, placeholder, autoComplete, id }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        minLength={6}
        className="input-field pr-10"
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        onClick={() => setShow((v) => !v)}
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [tokenStatus, setTokenStatus] = useState('verifying'); // verifying | valid | invalid
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  /* Verifikasi token */
  useEffect(() => {
    if (!token) {
      setTokenStatus('invalid');
      return;
    }
    authAPI
      .verifyResetToken(token)
      .then(() => setTokenStatus('valid'))
      .catch(() => setTokenStatus('invalid'));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Password dan konfirmasi tidak cocok.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword({ token, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(password);

  return (
    <AuthLayout
      rightTitle={`Buat password\nyang kuat`}
      rightSubtitle="Reset Password"
      rightDesc="Gunakan kombinasi huruf besar, angka, dan simbol agar akun DepreScan kamu lebih aman."
      rightExtra={<TipsRight />}
    >
      {/* loading memverifikasi */}
      {tokenStatus === 'verifying' && (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Memverifikasi link reset...</p>
        </div>
      )}

      {/* gagal token tidak valid */}
      {tokenStatus === 'invalid' && (
        <div className="flex flex-col items-center justify-center text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-gray-800 mb-2">
            Link Tidak Valid
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Link reset password ini sudah kedaluwarsa atau tidak valid. Silakan
            minta link baru.
          </p>
          <Link
            to="/forgot-password"
            className="btn-primary px-6 py-2.5 rounded-xl text-sm"
          >
            Minta Link Baru
          </Link>
        </div>
      )}

      {/* Valid dan reset */}
      {tokenStatus === 'valid' && !success && (
        <>
          <div className="mb-6">
            <h1 className="font-serif text-2xl text-gray-800 mb-2">
              Buat Password Baru
            </h1>
            <p className="text-sm text-gray-500">
              Masukkan password baru kamu. Pastikan minimal 6 karakter.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {' '}
            {/* Password baru */}
            <div>
              <label
                className="block text-sm font-semibold text-brand-500 mb-1.5"
                htmlFor="new-password"
              >
                Password Baru
              </label>
              <PasswordInput
                id="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
              />

              {strength && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300
                          ${i <= strength.level ? strength.bar : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs font-medium
                    ${strength.level === 1 ? 'text-red-500' : strength.level === 2 ? 'text-amber-500' : 'text-green-600'}`}
                  >
                    {strength.label}
                  </p>
                </div>
              )}
            </div>
            {/* Konfirm password */}
            <div>
              <label
                className="block text-sm font-semibold text-brand-500 mb-1.5"
                htmlFor="confirm-password"
              >
                Konfirmasi Password
              </label>
              <PasswordInput
                id="confirm-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Ulangi password baru"
                autoComplete="new-password"
              />
              {confirm && (
                <p
                  className={`text-xs mt-1 font-medium ${password === confirm ? 'text-green-600' : 'text-red-500'}`}
                >
                  {password === confirm
                    ? 'Password cocok ✓'
                    : 'Password tidak cocok'}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl mt-1"
            >
              {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
            </button>
          </form>
        </>
      )}

      {/* Berhasil */}
      {success && (
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-gray-800 mb-2">
            Password Berhasil Diubah!
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Password akun kamu telah berhasil diperbarui. Silakan login dengan
            password baru.
          </p>
          <Link
            to="/login"
            className="btn-primary px-6 py-2.5 rounded-xl text-sm"
          >
            Login Sekarang
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}

PasswordInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  id: PropTypes.string,
};
