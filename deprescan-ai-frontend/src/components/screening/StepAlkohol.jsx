import { SectionCard, ToggleGroup, SliderField } from './ScreeningShared';
import PropTypes from 'prop-types';

export default function StepAlkohol({ data, set, setData }) {
  return (
    <SectionCard
      letter="E"
      title="Konsumsi Alkohol"
      subtitle="Riwayat, frekuensi, dan pola minum"
    >
      {/* Pernah minum >=12x seumur hidup */}
      <div>
        <label className="flex flex-wrap items-center gap-1 text-sm font-semibold text-gray-800 mb-2">
          Pernah Minum Alkohol 12 Kali atau Lebih Seumur Hidup?{' '}
          <span className="text-red-500">*</span>
        </label>
        <ToggleGroup
          options={[
            { value: 1, label: 'Ya' },
            { value: 2, label: 'Tidak Pernah' },
          ]}
          value={data.ALQ111}
          onChange={(v) => {
            if (v === 2) {
              // Tidak pernah: reset semua field alkohol sekaligus (satu setData)
              setData((p) => ({
                ...p,
                ALQ111: 2,
                ALQ121: 0,
                ALQ130: 1,
                ALQ151: 2,
              }));
            } else {
              // Ya: reset ALQ151 ke null agar user wajib memilih
              setData((p) => ({
                ...p,
                ALQ111: 1,
                ALQ151: null,
              }));
            }
          }}
          cols={2}
        />
      </div>

      {data.ALQ111 === 1 && (
        <div className="flex flex-col gap-5 border-t border-brand-100 pt-5">
          {/* Frekuensi minum setahun terakhir */}
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">
              Seberapa sering minum dalam 12 bulan terakhir?{' '}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={data.ALQ121}
              onChange={(e) => set('ALQ121', Number(e.target.value))}
              className="input-field text-sm"
            >
              {[
                [0, 'Tidak pernah setahun ini'],
                [1, 'Setiap hari'],
                [2, '5–6 hari/minggu'],
                [3, '3–4 hari/minggu'],
                [4, '2 hari/minggu'],
                [5, '1 hari/minggu'],
                [6, '2–3 hari/bulan'],
                [7, '±1 hari/bulan'],
                [8, '7–11 hari/tahun'],
                [9, '3–6 hari/tahun'],
                [10, '1–2 hari/tahun'],
              ].map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Rata-rata gelas/hari saat minum */}
          <SliderField
            label="Rata-rata berapa gelas per hari saat minum?"
            required
            min={1}
            max={15}
            value={data.ALQ130}
            onChange={(v) => set('ALQ130', v)}
            unit=" gelas"
            note="1 gelas standar = 14 gram alkohol murni (contoh: 1 kaleng bir, 1 gelas anggur kecil)."
          />

          {/* Pernah minum >=5 gelas dalam satu hari */}
          <div>
            <label className="text-sm font-semibold text-gray-800 mb-2 block">
              Pernahkah Anda minum 5 gelas atau lebih dalam satu hari?{' '}
              <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2 leading-relaxed">
              Apakah pernah ada saat dalam hidup Anda ketika Anda mengonsumsi 5
              gelas atau lebih minuman beralkohol dalam satu hari — meski hanya
              sekali. (1 gelas = 14 gram alkohol murni, contoh: 1 kaleng bir
              atau 1 gelas anggur kecil)
            </p>
            <ToggleGroup
              options={[
                { value: 1, label: 'Ya, pernah' },
                { value: 2, label: 'Tidak pernah' },
              ]}
              value={data.ALQ151}
              onChange={(v) => set('ALQ151', v)}
              cols={2}
            />
          </div>
        </div>
      )}
    </SectionCard>
  );
}

StepAlkohol.propTypes = {
  data: PropTypes.object.isRequired,
  set: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
};
