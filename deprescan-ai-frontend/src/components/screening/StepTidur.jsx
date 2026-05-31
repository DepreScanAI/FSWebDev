import { SectionCard, SliderField, ToggleGroup } from './ScreeningShared';
import PropTypes from 'prop-types';

export default function StepTidur({ data, set }) {
  return (
    <SectionCard
      letter="C"
      title="Pola Tidur"
      subtitle="Durasi, kualitas & gangguan tidur"
    >
      <SliderField
        label="Jam Tidur Hari Kerja"
        required
        min={2}
        max={14}
        step={0.5}
        value={data.SLD012}
        onChange={(v) => set('SLD012', v)}
        unit=" jam"
        note="Rata-rata jam tidur malam di hari kerja (Senin–Jumat)."
        formatDecimals={1}
      />
      <SliderField
        label="Jam Tidur Akhir Pekan"
        required
        min={2}
        max={14}
        step={0.5}
        value={data.SLD013}
        onChange={(v) => set('SLD013', v)}
        unit=" jam"
        note="Rata-rata jam tidur malam di hari akhir pekan."
        formatDecimals={1}
      />

      {[
        {
          key: 'SLQ030',
          label: 'Frekuensi Mendengkur',
          opts: [
            { value: 1, label: 'Tidak Pernah/Jarang' },
            { value: 2, label: '1-2 malam/minggu' },
            { value: 3, label: '3-4 malam/minggu' },
            { value: 4, label: '5+ malam/minggu' },
          ],
          cols: 2,
        },
        {
          key: 'SLQ040',
          label: 'Berhenti Napas / Tersedak Saat Tidur',
          opts: [
            { value: 1, label: 'Tidak Pernah/Jarang' },
            { value: 2, label: '1-2 malam/minggu' },
            { value: 3, label: '3-4 malam/minggu' },
            { value: 4, label: '5+ malam/minggu' },
          ],
          cols: 2,
        },
        {
          key: 'SLQ050',
          label: 'Pernah Terdiagnosis Gangguan Tidur Oleh Dokter?',
          opts: [
            { value: 1, label: 'Ya' },
            { value: 2, label: 'Tidak' },
          ],
          cols: 2,
        },
      ].map(({ key, label, opts, cols }) => (
        <div key={key}>
          <label className="flex flex-wrap items-center gap-1 text-sm font-semibold text-gray-800 mb-2">
            {label} <span className="text-red-500">*</span>
          </label>
          <ToggleGroup
            options={opts}
            value={data[key]}
            onChange={(v) => set(key, v)}
            cols={cols}
          />
        </div>
      ))}

      {/* Frekuensi tidak segar — 5 opsi, 3 kolom di sm+, 2 kolom di mobile */}
      <div>
        <label className="flex flex-wrap items-center gap-1 text-sm font-semibold text-gray-800 mb-2">
          Seberapa Sering Merasa Tidak Segar Saat Bangun?{' '}
          <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            { value: 0, label: 'Tidak Pernah' },
            { value: 1, label: '1x/bulan' },
            { value: 2, label: '2-4x/bulan' },
            { value: 3, label: '5–14×/bulan' },
            { value: 4, label: '15-21x/bulan' },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('SLQ120', opt.value)}
              className={`py-3 px-2 rounded-xl text-sm font-semibold border transition-colors ${
                data.SLQ120 === opt.value
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-brand-500 border-brand-500 hover:bg-brand-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

StepTidur.propTypes = {
  data: PropTypes.object.isRequired,
  set: PropTypes.func.isRequired,
};
