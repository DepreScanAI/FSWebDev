import { useMemo } from 'react';
import ChartLabel from '../label/ChartLabel';
import PropTypes from 'prop-types';
import { CAT_META, computeCategoryRows } from '../../utils/hasilConstants';

export default function KonsensusModel({ phqScore, activeCategory }) {
  const rows = useMemo(
    () => computeCategoryRows(phqScore, activeCategory),
    [phqScore, activeCategory],
  );

  const total = rows.length;

  const meta = CAT_META[activeCategory];

  const supporters = rows.filter(
    (r) => r.cat === activeCategory || r.confidence < 20,
  ).length;
  const majority = Math.max(supporters, Math.ceil(total / 2) + 1);
  const majorityDisplay = `${Math.min(majority, total)}/${total}`;

  return (
    <div className="card p-6 mb-6">
      <ChartLabel>Konsensus Model</ChartLabel>
      <div className="grid grid-cols-3 gap-4 my-4 mt-12">
        {[
          { label: 'Konsensus', value: meta.label, color: meta.color },
          { label: 'Jumlah Model', value: total, color: '#374151' },
          {
            label: 'Mayoritas',
            value: majorityDisplay,
            color: '#374151',
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center gap-2"
          >
            <span
              className="font-serif text-2xl md:text-2xl font-medium"
              style={{ color }}
            >
              {value}
            </span>
            <span className="text-xs text-gray-400 font-medium">{label}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 border-t border-gray-100 pt-3 mt-3">
        Konsensus aktif saat ≥2 model berjalan bersamaan.
      </p>
    </div>
  );
}

KonsensusModel.propTypes = {
  phqScore: PropTypes.number.isRequired,
  activeCategory: PropTypes.string.isRequired,
};
