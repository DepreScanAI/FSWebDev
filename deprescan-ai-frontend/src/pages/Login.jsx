import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';

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

const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

export default function Login() {
  // ✅ Semua hooks di sini — SEBELUM kondisi apapun
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  // ✅ useGoogleLogin di sini — SEBELUM early return
  const googleLoginFlow = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError('');
      try {
        const res = await authAPI.googleAuth(tokenResponse.access_token);
        const { token, user: userData } = res.data.data;
        login(token, userData);
        navigate(redirectTo, { replace: true });
      } catch (err) {
        setError(err.response?.data?.message || 'Login Google gagal.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setError('Login Google gagal. Coba lagi.'),
    flow: 'implicit',
  });

  // ✅ Early return SETELAH semua hooks selesai
  if (user) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = isRegister
        ? await authAPI.register(form)
        : await authAPI.login({ email: form.email, password: form.password });
      const { token, user: userData } = res.data.data;
      login(token, userData);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      rightTitle="Selamat datang di Deprescan"
      rightSubtitle="Hi Welcome"
      rightDesc="Kesehatan mental adalah hal yang penting. Mulailah peduli dari sekarang, platform deteksi dini risiko depresi berbasis gaya hidup"
    >
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-700 transition-colors group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>

      {redirectTo !== '/' && (
        <div className="mb-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs text-center">
          Login diperlukan untuk mengakses halaman tersebut.
        </div>
      )}

      <div className="flex rounded-xl overflow-hidden mb-6 border-[1.5px] border-brand-500">
        {[
          ['Masuk', false],
          ['Daftar', true],
        ].map(([label, isReg]) => (
          <button
            key={label}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors duration-150
              ${
                isRegister === isReg
                  ? 'bg-brand-500 text-white'
                  : 'bg-white text-brand-500 hover:bg-brand-50'
              }`}
            onClick={() => {
              setIsRegister(isReg);
              setError('');
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        {isRegister && (
          <div>
            <label
              htmlFor="field-name"
              className="block text-sm font-semibold text-brand-500 mb-1.5"
            >
              Nama
            </label>
            <input
              id="field-name"
              name="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Nama lengkap"
              required={isRegister}
              className="input-field"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="field-email"
            className="block text-sm font-semibold text-brand-500 mb-1.5"
          >
            Email
          </label>
          <input
            id="field-email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="email@contoh.com"
            required
            autoComplete="email"
            className="input-field"
          />
        </div>

        <div>
          <label
            htmlFor="field-password"
            className="block text-sm font-semibold text-brand-500 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="field-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              className="input-field pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          {!isRegister && (
            <div className="flex justify-end mt-1.5">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-brand-500 hover:underline"
              >
                Lupa password?
              </Link>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 rounded-xl mt-1"
        >
          {loading ? 'Memproses...' : isRegister ? 'Daftar' : 'Login'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-xs">atau</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={() => {
          setError('');
          googleLoginFlow();
        }}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white rounded-xl px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 disabled:opacity-50"
      >
        {googleLoading ? (
          <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        {googleLoading ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        Dengan masuk, Anda menyetujui bahwa hasil screening ini bukan diagnosis
        klinis
      </p>
    </AuthLayout>
  );
}
