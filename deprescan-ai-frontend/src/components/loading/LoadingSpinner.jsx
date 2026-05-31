import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const STEP_INTERVAL = 700;
const AFTER_LAST_STEP_DELAY = 400;

function buildSteps(includeAiInsight) {
  const steps = [
    'Memproses 69 fitur gaya hidup',
    'Menjalankan model Deep Learning',
  ];
  if (includeAiInsight) {
    steps.push('Membuat AI Insight personal via Groq');
  }
  steps.push('Menyimpan ke riwayat akun Anda');
  return steps;
}

function AnimatedDots() {
  return (
    <span aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.35,
            ease: 'easeInOut',
          }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

export default function LoadingSpinner({ visible, includeAiInsight, onAnimationComplete }) {
  const [activeStep, setActiveStep] = useState(-1);
  const timersRef = useRef([]);

  useEffect(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (!visible) {
      setActiveStep(-1);
      return;
    }

    const steps = buildSteps(includeAiInsight);

    steps.forEach((_, i) => {
      const t = setTimeout(() => setActiveStep(i), i * STEP_INTERVAL);
      timersRef.current.push(t);
    });

    // setelah step terakhir muncul + buffer, beri sinyal animasi selesai
    const doneTimer = setTimeout(
      () => {
        if (onAnimationComplete) onAnimationComplete();
      },
      (steps.length - 1) * STEP_INTERVAL + AFTER_LAST_STEP_DELAY,
    );
    timersRef.current.push(doneTimer);

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, [visible, includeAiInsight, onAnimationComplete]);

  if (!visible) return null;

  const steps = buildSteps(includeAiInsight);

  return (
    <div className="loading-overlay">
      <div className="flex flex-col items-center gap-5 text-center px-6">

        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />

        <h3 className="font-serif text-2xl text-brand-500">
          Menganalisis data Anda
          <AnimatedDots />
        </h3>

        <div
          className="flex flex-col gap-2 text-sm text-gray-500 max-w-xs"
          style={{ minHeight: `${steps.length * 28}px` }}
        >
          {steps.map((text, i) =>
            activeStep >= i ? (
              <motion.p
                key={text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.42, 0, 0.58, 1],
                }}
              >
                {text}
              </motion.p>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}

LoadingSpinner.propTypes = {
  visible: PropTypes.bool.isRequired,
  includeAiInsight: PropTypes.bool,
  onAnimationComplete: PropTypes.func,
};

LoadingSpinner.defaultProps = {
  includeAiInsight: false,
  onAnimationComplete: null,
};
