import { SectionCard } from './ScreeningShared';
import PropTypes from 'prop-types';

export default function StepReview({ data, derived, phqScore }) {
  const avgSleep = (data.SLD012 + data.SLD013) / 2;
  const metMin = derived.TOTAL_MET_MIN || 0;
  const sedHrs = (data.PAD680 / 60).toFixed(1);
  const alcRisk = derived.ALCOHOL_RISK_SCORE || 0;
  const paCategory =
    metMin >= 500 ? 'Active' : metMin >= 150 ? 'Insuff.' : 'Inactive';

  const items = [
    { key: 'AVG_SLEEP', value: `${avgSleep.toFixed(1)} Jam` },
    {
      key: 'SOCIAL_JL',
      value: `${Math.abs(data.SLD013 - data.SLD012).toFixed(1)} Jam`,
    },
    { key: 'SHORT_SL', value: avgSleep < 6 ? 'Ya' : 'Tidak' },
    { key: 'TOTAL_MET', value: `${metMin.toFixed(0)} Min` },
    { key: 'SED_HOURS', value: `${sedHrs} Jam` },
    { key: 'ALC_RISK', value: `${alcRisk}/3` },
    { key: 'PHQ9_SCR', value: String(phqScore) },
    { key: 'PA_CAT', value: paCategory },
  ];

  return (
    <SectionCard
      letter="G"
      title="Variable Turunan (Auto)"
      subtitle="Dihitung otomatis dari input di atas"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(({ key, value }) => (
          <div
            key={key}
            className="bg-white border border-brand-100 rounded-xl p-4"
          >
            <div className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">
              {key}
            </div>
            <div className="font-bold text-brand-500 text-base">{value}</div>
          </div>
        ))}
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 leading-relaxed">
        <strong>Siap dianalisis!</strong> Klik{' '}
        <strong>&ldquo;Analisis &amp; Prediksi&rdquo;</strong> untuk mendapatkan
        hasil screening PHQ-9 beserta AI Insight personal. Hasil akan{' '}
        <strong>otomatis tersimpan</strong> ke riwayat akun Anda.
      </div>
    </SectionCard>
  );
}

StepReview.propTypes = {
  data: PropTypes.object.isRequired,
  derived: PropTypes.object.isRequired,
  phqScore: PropTypes.number,
};
