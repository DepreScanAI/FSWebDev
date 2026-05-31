import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PHQ9_OPTIONS } from '../../utils/helpers';

export function ToggleGroup({ options, value, onChange, cols = 2 }) {
  return (
    <div
      className="grid gap-2.5"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`py-3 px-3 rounded-xl text-sm font-semibold border transition-colors ${
            value === opt.value
              ? 'bg-brand-500 text-white border-brand-500'
              : 'bg-white text-brand-500 border-brand-500 hover:bg-brand-50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// Slider dan input
export function SliderField({
  label,
  required,
  min,
  max,
  value,
  onChange,
  step = 1,
  unit = '',
  note,
  showHours = false,
  formatDecimals,
}) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const fmt = useCallback(
    (v) =>
      formatDecimals !== null ? Number(v).toFixed(formatDecimals) : String(v),
    [formatDecimals],
  );

  const [inputStr, setInputStr] = useState(fmt(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputStr(fmt(value));
    }
  }, [value, isFocused, fmt]);

  return (
    <div>
      <label className="flex items-center gap-1 text-sm font-semibold text-gray-800 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <div className="relative h-5 flex items-center">
            <div className="absolute left-0 right-0 h-2 bg-brand-100 rounded-full" />
            <div
              className="absolute h-2 bg-brand-500 rounded-full pointer-events-none"
              style={{ width: `${pct}%` }}
            />

            <div
              className="absolute w-5 h-5 rounded-full bg-white border-2 border-brand-500 shadow-md pointer-events-none z-10 -translate-x-1/2"
              style={{ left: `${pct}%` }}
            />
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => {
                onChange(Number(e.target.value));
                if (!isFocused) setInputStr(fmt(e.target.value));
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-20"
            />
          </div>
          <div className="flex justify-between text-xs text-brand-500 font-semibold mt-1">
            <span>
              {fmt(min)}
              {unit}
            </span>
            <span>
              {fmt(max)}
              {unit}
            </span>
          </div>
        </div>
        <input
          type="text"
          inputMode="decimal"
          value={inputStr}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => {
            const raw = e.target.value;
            setInputStr(raw);

            const parsed = parseFloat(raw);
            if (!isNaN(parsed) && raw !== '' && raw !== '-') {
              onChange(Math.min(max, Math.max(min, parsed)));
            }
          }}
          onBlur={() => {
            setIsFocused(false);
            const parsed = parseFloat(inputStr);
            const safe = isNaN(parsed)
              ? min
              : Math.min(max, Math.max(min, parsed));
            onChange(safe);
            setInputStr(fmt(safe));
          }}
          className="w-16 h-11 text-center border border-brand-500 rounded-xl bg-white font-semibold text-sm outline-none focus:ring-2 focus:ring-brand-200"
        />
      </div>
      {showHours && unit === ' menit' && value > 0 && (
        <p className="text-xs text-brand-500 mt-1 font-semibold">
          ≈ {Math.floor(value / 60)} jam {value % 60} menit
        </p>
      )}
      {note && (
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{note}</p>
      )}
    </div>
  );
}

// pertanyaan PHQ-9
export function PhqQuestion({ question, value, onChange }) {
  return (
    <div
      className={`rounded-xl border p-5 ${question.sensitive ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-white'}`}
    >
      {question.sensitive && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
          Pertanyaan ini sensitif. Jika Anda memiliki pikiran seperti ini, mohon
          segera hubungi profesional kesehatan mental atau hotline krisis yang tersedia.
        </div>
      )}
      <p className="font-sans text-sm font-semibold text-gray-800 mb-3 leading-relaxed">
        {question.label}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {PHQ9_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-xs font-semibold transition-colors ${
              value === opt.value
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-brand-300 hover:bg-brand-50'
            }`}
          >
            <span className="text-base font-bold">{opt.value}</span>
            <span className="text-center leading-tight">{opt.label}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-brand-500 mt-2 font-medium">{question.note}</p>
    </div>
  );
}

// Section wrapper
export function SectionCard({ letter, title, subtitle, children }) {
  return (
    <div className="card overflow-hidden">
      <div className="section-header">
        <div className="w-11 h-11 rounded-full border-2 border-brand-500 bg-white flex items-center justify-center flex-shrink-0">
          <span className="font-serif text-brand-500 text-lg">{letter}</span>
        </div>
        <div>
          <h2 className="font-serif text-xl text-black">{title}</h2>
          <p className="font-serif text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="p-6 md:p-8 flex flex-col gap-6">{children}</div>
    </div>
  );
}

// Progress step bar
export function ProgressSteps({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex items-center gap-1">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              s < current
                ? 'bg-brand-500 border-brand-500 text-white'
                : s === current
                  ? 'bg-white border-brand-500 text-brand-500 shadow-md'
                  : 'bg-white border-gray-200 text-gray-400'
            }`}
          >
            {s < current ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              s
            )}
          </div>
          {s < total && (
            <div
              className={`h-0.5 w-5 transition-colors ${s < current ? 'bg-brand-500' : 'bg-gray-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

ToggleGroup.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.any, label: PropTypes.string }),
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  cols: PropTypes.number,
};

SliderField.propTypes = {
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  step: PropTypes.number,
  unit: PropTypes.string,
  note: PropTypes.string,
  showHours: PropTypes.bool,
  formatDecimals: PropTypes.number,
  displayValue: PropTypes.string,
};

PhqQuestion.propTypes = {
  question: PropTypes.shape({
    label: PropTypes.string.isRequired,
    note: PropTypes.string,
    sensitive: PropTypes.bool,
  }).isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

SectionCard.propTypes = {
  letter: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ProgressSteps.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};
