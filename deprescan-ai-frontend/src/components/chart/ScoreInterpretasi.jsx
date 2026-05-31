import PropTypes from 'prop-types';
import { phqCategory } from '../../utils/helpers';
import { CAT_MID, CATEGORIES } from '../../utils/hasilConstants';
import ChartLabel from '../label/ChartLabel';

export default function InsightAI({ prediction }) {
  const score = parseFloat(prediction.phq_score) || 0;
  const catInfo = phqCategory(score);
  const scorePct = (score / 27) * 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {/* Skor PHQ-9 */}
      <div className="card p-5">
        <ChartLabel>Skor PHQ-9</ChartLabel>
        <div className="flex items-end gap-2 mb-2">
          <span
            className="font-serif text-4xl"
            style={{ color: catInfo.color }}
          >
            {prediction.phq_score_int ?? Math.round(score)}
          </span>
          <span className="text-gray-400 text-lg mb-1">/27</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: catInfo.color }}
          />
          <span
            className="text-xs font-semibold"
            style={{ color: catInfo.color }}
          >
            {prediction.category}
          </span>
        </div>
        {prediction.confidence_band && (
          <p className="text-xs text-gray-400">
            Rentang skor: <strong>{prediction.confidence_band}</strong>
          </p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          {scorePct.toFixed(1)}% dari maksimum
        </p>
      </div>

      {/* Interpretasi */}
      <div className="card p-5">
        <ChartLabel>Interpretasi</ChartLabel>
        <div className="flex items-start gap-2 mb-3">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
            style={{ backgroundColor: catInfo.color }}
          />
          <p className="text-sm font-semibold text-gray-700">
            Kondisi mental saat ini dalam rentang yang{' '}
            {prediction.category === 'Minimal'
              ? 'sehat dan normal'
              : 'perlu diperhatikan lebih lanjut'}
          </p>
        </div>
        {CATEGORIES.map((cat) => {
          const ci = phqCategory(CAT_MID[cat]);
          return (
            <div
              key={cat}
              className={`flex items-center gap-2 py-0.5 text-xs ${prediction.category === cat ? 'font-bold' : 'text-gray-400'}`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${prediction.category !== cat ? 'opacity-30' : ''}`}
                style={{ backgroundColor: ci.color }}
              />
              <span
                style={
                  prediction.category === cat ? { color: catInfo.color } : {}
                }
              >
                {cat}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

InsightAI.propTypes = {
  prediction: PropTypes.shape({
    phq_score: PropTypes.number.isRequired,
    phq_score_int: PropTypes.number,
    category: PropTypes.string.isRequired,
    confidence_band: PropTypes.string,
  }).isRequired,
};
