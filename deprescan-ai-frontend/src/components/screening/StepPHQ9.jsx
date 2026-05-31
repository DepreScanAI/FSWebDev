import { SectionCard, PhqQuestion } from './ScreeningShared';
import { PHQ9_QUESTIONS } from '../../utils/helpers';
import PropTypes from 'prop-types';

export default function StepPHQ9({
  data,
  set,
  phqScore,
  phqSeverity,
  phqColor,
}) {
  return (
    <SectionCard
      letter="F"
      title="Kesehatan Mental – PHQ-9"
      subtitle="Patient Health Questionnaire · 9 item"
    >
      {/* Skor live realtime */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wide">
          Skor PHQ-9 Real-time
        </p>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-3 rounded-full phq-bar-fill"
              style={{
                width: `${(phqScore / 27) * 100}%`,
                backgroundColor: phqColor,
              }}
            />
          </div>
          <span
            className="font-bold text-sm w-6 text-right"
            style={{ color: phqColor }}
          >
            {phqScore}
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>0 (Minimal)</span>
          <span className="font-semibold" style={{ color: phqColor }}>
            {phqSeverity}
          </span>
          <span>27 (Severe)</span>
        </div>
      </div>

      {/* Petunjuk — wraps dengan baik di mobile */}
      <div className="bg-brand-50 border-l-4 border-brand-500 px-4 py-3 rounded-r-xl text-sm leading-relaxed">
        <strong>Petunjuk PHQ-9:</strong> Dalam{' '}
        <strong>2 minggu terakhir</strong>, seberapa sering Anda terganggu?
        <p className="text-gray-600 text-xs mt-1">
          0 = Tidak sama sekali &nbsp;·&nbsp; 1 = Beberapa hari &nbsp;·&nbsp; 2
          = Lebih dari separuh hari &nbsp;·&nbsp; 3 = Hampir setiap hari
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {PHQ9_QUESTIONS.map((q) => (
          <PhqQuestion
            key={q.key}
            question={q}
            value={data[q.key]}
            onChange={(v) => set(q.key, v)}
          />
        ))}
      </div>
    </SectionCard>
  );
}

StepPHQ9.propTypes = {
  data: PropTypes.object.isRequired,
  set: PropTypes.func.isRequired,
  phqScore: PropTypes.number,
  phqSeverity: PropTypes.string,
  phqColor: PropTypes.string,
};
