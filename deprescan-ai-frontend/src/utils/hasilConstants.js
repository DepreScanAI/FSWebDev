// Constants dan utilitas terkait hasil pertanyaan PHQ-9
export const CAT_META = {
  Minimal: {
    color: '#16a34a',
    bg: '#dcfce7',
    border: '#86efac',
    label: 'Minimal',
  },
  Mild: { color: '#ca8a04', bg: '#fef9c3', border: '#fde047', label: 'Mild' },
  Moderate: {
    color: '#ea580c',
    bg: '#ffedd5',
    border: '#fdba74',
    label: 'Moderate',
  },
  'Moderately Severe': {
    color: '#e11d48',
    bg: '#ffe4e6',
    border: '#fda4af',
    label: 'Mod. Severe',
  },
  Severe: {
    color: '#7c3aed',
    bg: '#ede9fe',
    border: '#c4b5fd',
    label: 'Severe',
  },
};

export const CATEGORIES = [
  'Minimal',
  'Mild',
  'Moderate',
  'Moderately Severe',
  'Severe',
];

// Titik tengah skor untuk tiap kategori
export const CAT_MID = {
  Minimal: 2,
  Mild: 7,
  Moderate: 12,
  'Moderately Severe': 17,
  Severe: 22,
};

export function computeCategoryRows(phqScore, activeCategory) {
  // Anchor pada midpoint activeCategory (ground truth dari backend), bukan phqScore mentah.
  // Dengan ini, activeCategory SELALU mendapat confidence tertinggi dan konsisten
  // dengan ScoreHero / ScoreInterpretasi tanpa terpengaruh boundary overlap.
  const activeMid = CAT_MID[activeCategory] ?? phqScore;

  const inv = CATEGORIES.map((cat) => {
    return 1 / (Math.abs(activeMid - CAT_MID[cat]) + 0.5);
  });

  const total = inv.reduce((a, b) => a + b, 0);
  const rawConfs = inv.map((v) => (v / total) * 100);

  // Pastikan totalnya pas 100 setelah round dengan menyesuaikan selisih ke activeCategory
  const confs = rawConfs.map((v) => Math.round(v));
  const diff = 100 - confs.reduce((a, b) => a + b, 0);
  const activeIdx = CATEGORIES.indexOf(activeCategory);
  if (activeIdx !== -1) confs[activeIdx] = Math.max(0, confs[activeIdx] + diff);

  return CATEGORIES.map((cat, i) => ({
    cat,
    phqEst:
      cat === activeCategory
        ? phqScore.toFixed(1)
        : Math.min(
            27,
            Math.max(0, CAT_MID[cat] * (confs[i] / 100) * 2),
          ).toFixed(1),
    confidence: confs[i],
    isActive: cat === activeCategory,
  }));
}
