import { useMemo } from 'react';
import ChartLabel from '../label/ChartLabel';
import PropTypes from 'prop-types';
import { CAT_META, computeCategoryRows } from '../../utils/hasilConstants';

export default function ModelResultsTable({ phqScore, activeCategory }) {
  const rows = useMemo(
    () => computeCategoryRows(phqScore, activeCategory),
    [phqScore, activeCategory],
  );

  return (
    <div className="card overflow-hidden mb-6">
      <div className="px-6 pt-5 pb-3">
        <ChartLabel>Hasil Semua Model</ChartLabel>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-y border-gray-100">
            {['MODEL PREDIKSI', 'PHQ-9 EST', 'CONFIDENCE', 'STATUS'].map(
              (h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map(({ cat, phqEst, confidence, isActive }) => {
            const meta = CAT_META[cat];

            // isActive = ground truth dari backend, bukan re-kalkulasi
            const bg = isActive ? meta.bg : 'rgba(156, 163, 175, 0.1)';
            const color = isActive ? meta.color : '#9ca3af';
            const border = isActive ? meta.border : '#d1d5db';

            return (
              <tr
                key={cat}
                className={`${isActive ? 'bg-brand-50/30' : ''} hover:bg-gray-50/50 transition-colors`}
              >
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border"
                    style={{
                      backgroundColor: bg,
                      color,
                      borderColor: border,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {meta.label}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className="font-mono text-sm font-semibold"
                    style={{ color }}
                  >
                    {phqEst}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${confidence}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold w-8 text-right"
                      style={{ color }}
                    >
                      {confidence}%
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-medium"
                    style={{ color }}
                  >
                    {isActive ? (
                      <>
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Aktif
                      </>
                    ) : (
                      'Pasif'
                    )}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

ModelResultsTable.propTypes = {
  phqScore: PropTypes.number.isRequired,
  activeCategory: PropTypes.string.isRequired,
};
