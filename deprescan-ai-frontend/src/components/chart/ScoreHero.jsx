import PropTypes from 'prop-types';
import { phqCategory, phqCategoryIndonesian } from '../../utils/helpers';

export default function ScoreHero({ prediction }) {
  const score = parseFloat(prediction.phq_score) || 0;
  const catInfo = phqCategory(score);
  const catID = phqCategoryIndonesian(prediction.category);
  const scorePct = (score / 27) * 100;
  const isClinical = score >= 10;

  return (
    <div
      className="card mb-6 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${catInfo.bg} 0%, #ffffff 60%)`,
        borderColor: `${catInfo.color}30`,
      }}
    >
      <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <div
            className="inline-flex px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              backgroundColor: `${catInfo.color}20`,
              color: catInfo.color,
            }}
          >
            {catID}
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-black mb-3">
            {isClinical
              ? 'Terdapat gejala depresi yang signifikan'
              : 'Terdapat gejala depresi ringan'}
          </h2>
          {prediction.disclaimer && (
            <p className="text-gray-500 text-sm leading-relaxed">
              {prediction.disclaimer}
            </p>
          )}
          <p
            className="text-xs mt-3 font-medium"
            style={{ color: catInfo.color }}
          >
            {isClinical
              ? 'Skor ≥ 10 — Klinis Signifikan'
              : 'Skor < 10 — Di bawah threshold klinis'}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative w-40 h-40">
            <svg
              className="w-40 h-40 -rotate-90 relative z-10"
              viewBox="0 0 160 160"
            >
              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke={`${catInfo.color}25`}
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="68"
                fill="none"
                stroke={catInfo.color}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 68}`}
                strokeDashoffset={`${2 * Math.PI * 68 * (1 - scorePct / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <span
                className="font-serif text-4xl font-bold"
                style={{ color: catInfo.color }}
              >
                {score.toFixed(1)}
              </span>
              <span className="text-gray-400 text-xs font-semibold">
                dari 27
              </span>
            </div>
          </div>

          <div className="w-full max-w-xs">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: `${catInfo.color}20` }}
            >
              <div
                className="h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${scorePct}%`,
                  backgroundColor: catInfo.color,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Minimal</span>
              <span className="font-semibold" style={{ color: catInfo.color }}>
                {prediction.category}
              </span>
              <span>Severe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ScoreHero.propTypes = {
  prediction: PropTypes.shape({
    phq_score: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    disclaimer: PropTypes.string,
  }).isRequired,
};
