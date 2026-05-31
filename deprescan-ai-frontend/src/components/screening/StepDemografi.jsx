import { SectionCard, ToggleGroup, SliderField } from './ScreeningShared';
import PropTypes from 'prop-types';

export default function StepDemografi({ data, set, user }) {
  return (
    <SectionCard
      letter="A"
      title="Demografi"
      subtitle="Identitas dan profil dasar"
    >
      <div>
        <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mb-2">
          Nama{' '}
          <span className="text-gray-400 font-normal text-xs">(Opsional)</span>
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder={user?.name || 'Anonim'}
          className="input-field"
        />
        <div className="mt-1.5 flex bg-gray-100 overflow-hidden rounded-lg">
          <div className="w-1 bg-brand-500 flex-shrink-0" />
          <p className="px-3 py-2 text-brand-500 text-xs font-semibold">
            Hanya untuk identitas laporan. Jika kosong, nama akun Anda
            digunakan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-1 text-sm font-semibold text-gray-800 mb-2">
            Jenis Kelamin <span className="text-red-500">*</span>
          </label>
          <ToggleGroup
            options={[
              { value: 1, label: 'Laki-laki' },
              { value: 2, label: 'Perempuan' },
            ]}
            value={data.GENDER}
            onChange={(v) => set('GENDER', v)}
            cols={2}
          />
        </div>
        <SliderField
          label="Usia"
          required
          min={18}
          max={80}
          value={data.AGE}
          onChange={(v) => set('AGE', v)}
          unit=" th"
        />
      </div>

      <div>
        <label className="flex items-center gap-1 text-sm font-semibold text-gray-800 mb-2">
          Ras <span className="text-red-500">*</span>
        </label>
        <select
          value={data.RACE}
          onChange={(e) =>
            set('RACE', e.target.value === '' ? '' : Number(e.target.value))
          }
          className="input-field"
        >
          <option value="">-- Pilih Ras --</option>
          {[
            [1, 'Hispanik / Latino'],
            [2, 'Non-Hispanik Kulit Hitam'],
            [3, 'Non-Hispanik Kulit Putih'],
            [4, 'Non-Hispanik Asia'],
            [5, 'Hispanik Meksiko'],
            [6, 'Ras Lainnya / Campuran'],
          ].map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-1 text-sm font-semibold text-gray-800 mb-2">
          Tingkat Pendidikan <span className="text-red-500">*</span>
        </label>
        <ToggleGroup
          options={[
            { value: 1, label: 'Tidak tamat SMP' },
            { value: 2, label: 'SMP / Kelas 9–11' },
            { value: 3, label: 'SMA / Setara' },
            { value: 4, label: 'D1–D3 / Kuliah' },
            { value: 5, label: 'S1 ke atas' },
          ]}
          value={data.EDUCATION}
          onChange={(v) => set('EDUCATION', v)}
          cols={3}
        />
      </div>

      <div>
        <label className="flex items-center gap-1 text-sm font-semibold text-gray-800 mb-2">
          Status Pernikahan <span className="text-red-500">*</span>
        </label>
        <ToggleGroup
          options={[
            { value: 1, label: 'Menikah' },
            { value: 3, label: 'Belum menikah' },
            { value: 4, label: 'Janda/Duda' },
            { value: 5, label: 'Cerai' },
            { value: 6, label: 'Pisah (masih menikah)' },
            { value: 2, label: 'Tinggal bersama pasangan' },
          ]}
          value={data.MARITAL}
          onChange={(v) => set('MARITAL', v)}
          cols={3}
        />
      </div>
    </SectionCard>
  );
}

StepDemografi.propTypes = {
  data: PropTypes.object.isRequired,
  set: PropTypes.func.isRequired,
  user: PropTypes.object,
};
