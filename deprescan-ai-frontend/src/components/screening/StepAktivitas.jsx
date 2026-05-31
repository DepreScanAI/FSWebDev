import { SectionCard, ToggleGroup, SliderField } from './ScreeningShared';
import PropTypes from 'prop-types';

const ACTIVITY_FIELDS = [
  {
    toggleKey: 'PAQ605',
    toggleLabel: 'Pekerjaan Melibatkan Aktivitas Berat?',
    toggleNote:
      'Angkat benda berat, konstruksi fisik, napas cepat 10 menit atau lebih.',
    minuteKey: 'PAD615',
    minuteLabel: 'Berapa menit aktivitas berat per hari (di tempat kerja)?',
  },
  {
    toggleKey: 'PAQ620',
    toggleLabel: 'Pekerjaan Melibatkan Aktivitas Sedang?',
    toggleNote:
      'Contoh: membawa barang ringan, pekerjaan yang menyebabkan sedikit napas lebih cepat.',
    minuteKey: 'PAD630',
    minuteLabel: 'Berapa menit aktivitas sedang per hari (di tempat kerja)?',
  },
  {
    toggleKey: 'PAQ635',
    toggleLabel: 'Berjalan Kaki / Bersepeda Sebagai Transportasi?',
    toggleNote: 'Perjalanan ke sekolah, tempat kerja, atau tempat belanja.',
    minuteKey: 'PAD645',
    minuteLabel: 'Berapa menit berjalan/bersepeda per hari untuk transportasi?',
  },
  {
    toggleKey: 'PAQ650',
    toggleLabel: 'Olahraga / Rekreasi Berat?',
    toggleNote: 'Lari, renang cepat, HIIT — napas cepat 10 menit atau lebih.',
    minuteKey: 'PAD660',
    minuteLabel: 'Berapa menit olahraga/rekreasi berat per hari?',
  },
  {
    toggleKey: 'PAQ665',
    toggleLabel: 'Olahraga / Rekreasi Sedang?',
    toggleNote: 'Bersepeda santai, yoga, jalan cepat — 10 menit atau lebih.',
    minuteKey: 'PAD675',
    minuteLabel: 'Berapa menit olahraga/rekreasi sedang per hari?',
  },
];

export default function StepAktivitas({ data, set }) {
  const handleToggle = (toggleKey, minuteKey, val) => {
    set(toggleKey, val);
    if (val === 2) set(minuteKey, 0);
  };

  return (
    <SectionCard
      letter="D"
      title="Aktivitas Fisik"
      subtitle="Kerja, transportasi, olahraga & sedentary"
    >
      {ACTIVITY_FIELDS.map(
        ({ toggleKey, toggleLabel, toggleNote, minuteKey, minuteLabel }) => (
          <div key={toggleKey} className="flex flex-col gap-3">
            <div>
              <label className="flex flex-wrap items-center gap-1 text-sm font-semibold text-gray-800 mb-2">
                {toggleLabel} <span className="text-red-500">*</span>
              </label>
              {toggleNote && (
                <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                  {toggleNote}
                </p>
              )}
              <ToggleGroup
                options={[
                  { value: 1, label: 'Ya' },
                  { value: 2, label: 'Tidak' },
                ]}
                value={data[toggleKey]}
                onChange={(v) => handleToggle(toggleKey, minuteKey, v)}
                cols={2}
              />
            </div>

            {/* Slider menit muncul hanya jika user pilih "Ya" */}
            {data[toggleKey] === 1 && (
              <div className="pl-3 md:pl-4 border-l-2 border-brand-200 pt-1">
                <SliderField
                  label={minuteLabel}
                  min={0}
                  max={480}
                  step={5}
                  value={data[minuteKey] ?? 0}
                  onChange={(v) => set(minuteKey, v)}
                  unit=" menit"
                  showHours
                />
              </div>
            )}
          </div>
        ),
      )}

      <SliderField
        label="Total Duduk / Berbaring Per Hari"
        required
        min={0}
        max={1320}
        step={15}
        value={data.PAD680}
        onChange={(v) => set('PAD680', v)}
        unit=" menit"
        showHours
        note="Total waktu duduk kerja + nonton TV + nyetir + HP. Tidak termasuk waktu tidur."
      />
    </SectionCard>
  );
}

StepAktivitas.propTypes = {
  data: PropTypes.object.isRequired,
  set: PropTypes.func.isRequired,
};
