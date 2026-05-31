import { SectionCard, SliderField } from './ScreeningShared';
import PropTypes from 'prop-types';

export default function StepEkonomi({ data, set }) {
  return (
    <SectionCard
      letter="B"
      title="Ekonomi"
      subtitle="Pendapatan & kemiskinan relatif"
    >
      <div>
        <label className="text-sm font-semibold text-gray-800 mb-2 block">
          Pendapatan Rumah Tangga / Bulan
        </label>
        <select
          value={data.INCOME_CAT}
          onChange={(e) =>
            set(
              'INCOME_CAT',
              e.target.value === '' ? '' : Number(e.target.value),
            )
          }
          className="input-field text-sm"
        >
          <option value="">-- Pilih Pendapatan --</option>
          {[
            [1, '< Rp 2,5 juta'],
            [2, 'Rp 2,5 – 4,9 juta'],
            [3, 'Rp 5 – 7,4 juta'],
            [4, 'Rp 7,5 – 9,9 juta'],
            [5, 'Rp 10 – 14,9 juta'],
            [6, 'Rp 15 – 19,9 juta'],
            [7, 'Rp 20 – 24,9 juta'],
            [8, 'Rp 25 – 34,9 juta'],
            [9, 'Rp 35 – 54,9 juta'],
            [10, 'Rp 55 – 74,9 juta'],
            [14, 'Rp 75 – 99,9 juta'],
            [15, '≥ Rp 100 juta'],
          ].map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
          Estimasi total pendapatan rumah tangga per bulan.
        </p>
      </div>

      <SliderField
        label="Rasio Kemiskinan (PIR)"
        required
        min={1.0}
        max={5.0}
        step={0.1}
        value={data.PIR}
        onChange={(v) => set('PIR', v)}
        note="PIR = Pendapatan / Garis Kemiskinan. 1.0 = tepat di garis kemiskinan. 5.0 = batas atas."
        formatDecimals={1}
      />
    </SectionCard>
  );
}

StepEkonomi.propTypes = {
  data: PropTypes.object.isRequired,
  set: PropTypes.func.isRequired,
};
