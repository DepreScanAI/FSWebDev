import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { screeningAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { computeDerivedFeatures } from '../utils/helpers';

import { ProgressSteps } from '../components/screening/ScreeningShared';
import StepDemografi from '../components/screening/StepDemografi';
import StepEkonomi from '../components/screening/StepEkonomi';
import StepTidur from '../components/screening/StepTidur';
import StepAktivitas from '../components/screening/StepAktivitas';
import StepAlkohol from '../components/screening/StepAlkohol';
import StepPHQ9 from '../components/screening/StepPHQ9';
import StepReview from '../components/screening/StepReview';

import LoadingSpinner from '../components/loading/LoadingSpinner';

const INIT = {
  name: '',
  GENDER: null,
  AGE: 25,
  RACE: '',
  EDUCATION: null,
  MARITAL: null,
  INCOME_CAT: '',
  PIR: 3.0,
  SLD012: 7,
  SLD013: 7,
  SLQ030: null,
  SLQ040: null,
  SLQ050: null,
  SLQ120: null,
  PAQ605: null,
  PAQ620: null,
  PAQ635: null,
  PAQ650: null,
  PAQ665: null,
  PAD680: 300,
  PAD615: 0,
  PAD630: 0,
  PAD645: 0,
  PAD660: 0,
  PAD675: 0,
  ALQ111: null,
  ALQ121: 0,
  ALQ130: 1,
  ALQ151: null,
  DPQ010: null,
  DPQ020: null,
  DPQ030: null,
  DPQ040: null,
  DPQ050: null,
  DPQ060: null,
  DPQ070: null,
  DPQ080: null,
  DPQ090: null,
};

export default function Screening() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [includeAiInsight, setIncludeAiInsight] = useState(false);

  // Koordinasi: tunggu API selesai DAN animasi selesai sebelum navigate
  const pendingNavRef = useRef(null);
  const animDoneRef = useRef(false);

  // Redirect ke login jika belum terverifikasi auth
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, {
        replace: true,
      });
    }
  }, [user, authLoading, navigate, location.pathname]);

  const set = (key, val) => setData((p) => ({ ...p, [key]: val }));

  const phqScore = useMemo(() => {
    const keys = [
      'DPQ010', 'DPQ020', 'DPQ030', 'DPQ040', 'DPQ050',
      'DPQ060', 'DPQ070', 'DPQ080', 'DPQ090',
    ];
    return keys.reduce((s, k) => s + (data[k] ?? 0), 0);
  }, [data]);

  const phqSeverity =
    phqScore <= 4
      ? 'Minimal'
      : phqScore <= 9
        ? 'Mild'
        : phqScore <= 14
          ? 'Moderate'
          : phqScore <= 19
            ? 'Moderately Severe'
            : 'Severe';
  const phqColor = {
    Minimal: '#1d8a5e',
    Mild: '#d97706',
    Moderate: '#ea580c',
    'Moderately Severe': '#dc2626',
    Severe: '#7c3aed',
  }[phqSeverity];

  const derived = useMemo(() => computeDerivedFeatures(data), [data]);

  const canProceed = () => {
    if (step === 1) {
      return (
        data.GENDER !== null &&
        data.RACE !== '' &&
        data.EDUCATION !== null &&
        data.MARITAL !== null
      );
    }
    if (step === 2) {
      return data.INCOME_CAT !== '';
    }
    if (step === 3) {
      return (
        data.SLQ030 !== null &&
        data.SLQ040 !== null &&
        data.SLQ050 !== null &&
        data.SLQ120 !== null
      );
    }
    if (step === 4) {
      return (
        data.PAQ605 !== null &&
        data.PAQ620 !== null &&
        data.PAQ635 !== null &&
        data.PAQ650 !== null &&
        data.PAQ665 !== null
      );
    }
    if (step === 5) {
      // belum pilih sama sekali
      if (data.ALQ111 === null) return false;
      // "Tidak Pernah" → cukup ALQ111 = 2, tidak perlu cek ALQ151
      if (data.ALQ111 === 2) return true;
      // "Ya" → wajib pilih juga ALQ151
      return data.ALQ151 !== null;
    }
    if (step === 6) {
      return [
        'DPQ010', 'DPQ020', 'DPQ030', 'DPQ040', 'DPQ050',
        'DPQ060', 'DPQ070', 'DPQ080', 'DPQ090',
      ].every((k) => data[k] !== null);
    }
    return true;
  };

  // Dipanggil oleh LoadingSpinner saat semua step animasi selesai ditampilkan
  const handleAnimationComplete = useCallback(() => {
    animDoneRef.current = true;
    if (pendingNavRef.current) {
      const code = pendingNavRef.current;
      pendingNavRef.current = null;
      sessionStorage.setItem('deprescan_just_finished', code);
      sessionStorage.removeItem('deprescan_result');
      navigate(`/hasil/${code}`);
    }
  }, [navigate]);

  const handleSubmit = async () => {
    const phqKeys = [
      'DPQ010', 'DPQ020', 'DPQ030', 'DPQ040', 'DPQ050',
      'DPQ060', 'DPQ070', 'DPQ080', 'DPQ090',
    ];
    if (!phqKeys.every((k) => data[k] !== null)) {
      setError('Lengkapi semua pertanyaan PHQ-9 terlebih dahulu.');
      return;
    }

    // Reset koordinasi setiap kali submit baru
    pendingNavRef.current = null;
    animDoneRef.current = false;

    setLoading(true);
    setError('');

    try {
      const payload = computeDerivedFeatures(data);
      const res = await screeningAPI.predict({
        ...payload,
        name_label: data.name || user?.name || 'Anonim',
        include_ai_insight: includeAiInsight,
      });

      const { session } = res.data.data;

      if (session?.session_code) {
        if (animDoneRef.current) {
          // Animasi sudah selesai duluan — navigate sekarang
          animDoneRef.current = false;
          sessionStorage.setItem('deprescan_just_finished', session.session_code);
          sessionStorage.removeItem('deprescan_result');
          navigate(`/hasil/${session.session_code}`);
        } else {
          // Animasi belum selesai — simpan kode, biarkan handleAnimationComplete yang navigate
          pendingNavRef.current = session.session_code;
        }
      } else {
        setLoading(false);
        navigate('/screening');
      }
    } catch (err) {
      setLoading(false);
      pendingNavRef.current = null;
      animDoneRef.current = false;
      if (err.response?.status === 401) return;
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Gagal menghubungi server.';
      setError(`Prediksi gagal: ${msg}`);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepDemografi data={data} set={set} user={user} />;
      case 2:
        return <StepEkonomi data={data} set={set} />;
      case 3:
        return <StepTidur data={data} set={set} />;
      case 4:
        return <StepAktivitas data={data} set={set} />;
      case 5:
        return <StepAlkohol data={data} set={set} setData={setData} />;
      case 6:
        return (
          <StepPHQ9
            data={data}
            set={set}
            phqScore={phqScore}
            phqSeverity={phqSeverity}
            phqColor={phqColor}
          />
        );
      case 7:
        return <StepReview data={data} derived={derived} phqScore={phqScore} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-screen-sm mx-auto px-4 py-10">
        {/* header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-black mb-2">
            Form Isian <span className="text-brand-500">Kesehatan Mental</span>
          </h1>
          <p className="font-sans text-gray-500 text-sm mb-3">
            Isi semua pertanyaan bertanda{' '}
            <span className="text-red-500">*</span> sebelum melanjutkan. Data
            diproses menggunakan model Deep Learning.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <ProgressSteps current={step} total={totalSteps} />
        </div>

        {/* error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* step aktif */}
        {renderStep()}

        <div className="flex flex-col gap-4 mt-8">
          {/* Opsi AI Insight — hanya tampil di step 7 */}
          {step === totalSteps && (
            <div className="flex items-start gap-3 p-4 bg-brand-50 border border-brand-200 rounded-xl">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="ai-insight-toggle"
                  type="checkbox"
                  checked={includeAiInsight}
                  onChange={(e) => setIncludeAiInsight(e.target.checked)}
                  className="w-4 h-4 accent-brand-500 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="ai-insight-toggle"
                  className="text-sm font-semibold text-gray-800 cursor-pointer"
                >
                  Sertakan Rekomendasi AI Insight
                </label>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Aktifkan untuk mendapatkan analisis dan rekomendasi personal
                  dari Groq AI saat hasil keluar.{' '}
                  <span className="text-brand-500 font-medium">
                    Catatan: jika tidak dicentang, AI Insight tetap bisa
                    diaktifkan nanti di halaman hasil atau riwayat.
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((p) => p - 1)}
                className="btn-secondary px-8 py-3 rounded-xl"
              >
                Kembali
              </button>
            )}
            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setStep((p) => p + 1);
                }}
                disabled={!canProceed()}
                className="btn-primary px-10 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lanjut
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary px-10 py-3 rounded-xl min-w-[180px] justify-center flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  'Analisis & Prediksi'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* proses prediksi loading */}
      <LoadingSpinner
        visible={loading}
        // untuk fungsi include ai insight
        includeAiInsight={includeAiInsight}
        onAnimationComplete={handleAnimationComplete}
      />
    </div>
  );
}

const totalSteps = 7;
