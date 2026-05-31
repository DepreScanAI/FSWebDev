import { nanoid } from 'nanoid';

// Utility functions untuk membantu proses rendering hasil dan interpretasi PHQ-9
export const phqCategory = (score) => {
  if (score <= 4)
    return {
      label: 'Minimal',
      color: '#1d8a5e',
      bg: '#e0f5ec',
      chipBg: '#e0f5ec',
    };
  if (score <= 9)
    return {
      label: 'Mild',
      color: '#d97706',
      bg: '#fef3c7',
      chipBg: '#fef3c7',
    };
  if (score <= 14)
    return {
      label: 'Moderate',
      color: '#ea580c',
      bg: '#fff7ed',
      chipBg: '#fff7ed',
    };
  if (score <= 19)
    return {
      label: 'Moderately Severe',
      color: '#dc2626',
      bg: '#fef2f2',
      chipBg: '#fef2f2',
    };
  return {
    label: 'Severe',
    color: '#7c3aed',
    bg: '#f5f3ff',
    chipBg: '#f5f3ff',
  };
};

export const phqCategoryIndonesian = (label) =>
  ({
    Minimal: 'Depresi Minimal',
    Mild: 'Depresi Ringan',
    Moderate: 'Depresi Sedang',
    'Moderately Severe': 'Depresi Cukup Berat',
    Severe: 'Depresi Berat',
  })[label] ?? label;

// Format tanggal dalam bahasa Indonesia
export const formatDateID = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateTimeID = (dateStr) => {
  return new Date(dateStr)
    .toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace('.', ' : ');
};

// Membuat sesi skreening kode menggunakan nanoid
export const generateSessionCode = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const rand = nanoid(8);
  return `${date}_${time}_${rand}`;
};

export const deriveLifestyleMetrics = (inputData = {}) => {
  const f = (k, d = 0) => {
    const v = inputData[k];
    return v !== undefined && v !== null ? Number(v) : d;
  };

  const storedMet = f('TOTAL_MET_MIN', 0);
  const pad615 = f('PAD615', 0),
    pad660 = f('PAD660', 0);
  const pad630 = f('PAD630', 0),
    pad645 = f('PAD645', 0),
    pad675 = f('PAD675', 0);
  const computedVig = (pad615 + pad660) * 5;
  const computedMod = (pad630 + pad645 + pad675) * 5;
  const computedMet = computedVig * 8 + computedMod * 4;

  const metMin = Math.max(storedMet, computedMet);

  const storedInactive = f('PHYSICALLY_INACTIVE', -1);
  const inactive = storedInactive >= 0 ? storedInactive : metMin < 150 ? 1 : 0;
  const meetsPA = metMin >= 500 ? 1 : 0;

  let activityRisk;
  if (inactive) {
    activityRisk = 4.2;
  } else if (!meetsPA) {
    activityRisk = Math.max(0.5, 3.5 * (1 - (metMin - 150) / 350));
  } else {
    activityRisk = Math.max(0, 1 - (metMin - 500) / 2000);
  }
  activityRisk = Math.min(5, activityRisk);

  const sleepRisk = Math.min(5, f('SLEEP_RISK_SCORE', 0));
  const alcoholRisk = Math.min(5, f('ALCOHOL_RISK_SCORE', 0) * 1.67);
  const sedRisk = Math.min(5, Math.max(0, f('SEDENTARY_HOURS', 0) - 4));
  const livingAlone = f('LIVING_ALONE', 0);
  const marital = f('MARITAL', 1);

  const aloneProxy = [2, 3, 4, 5].includes(marital) ? 1 : livingAlone;
  const socialRisk = Math.min(
    5,
    aloneProxy ? 4.0 : Math.min(3, f('UNRESTED_FREQ', 0) * 0.8),
  );
  const incomeBin = f('INCOME_BINARY', 0);
  const pir = f('PIR', 2.5);
  const econRisk = Math.min(
    5,
    incomeBin ? 4.5 : pir < 1 ? 4.2 : pir < 2 ? 3.0 : pir < 3.5 ? 1.5 : 0.6,
  );

  const paLabel = inactive
    ? 'Tidak aktif'
    : meetsPA
      ? 'Memenuhi guideline PA'
      : 'Kurang aktif';

  return [
    {
      axis: 'Tidur',
      risk: sleepRisk,
      safe: 5 - sleepRisk,
      detail: `Sleep risk ${sleepRisk.toFixed(2)}/5 · Avg ${f('AVG_SLEEP_HOURS', 0).toFixed(1)} jam`,
    },
    {
      axis: 'Alkohol',
      risk: alcoholRisk,
      safe: 5 - alcoholRisk,
      detail: `Alcohol risk ${alcoholRisk.toFixed(2)}/5`,
    },
    {
      axis: 'Aktivitas',
      risk: activityRisk,
      safe: 5 - activityRisk,
      detail: `${paLabel} · MET ${metMin.toFixed(0)} min/mgg`,
    },
    {
      axis: 'Sedentary',
      risk: sedRisk,
      safe: 5 - sedRisk,
      detail: `${f('SEDENTARY_HOURS', 0).toFixed(1)} jam/hari`,
    },
    {
      axis: 'Sosial',
      risk: socialRisk,
      safe: 5 - socialRisk,
      detail: `Living alone: ${aloneProxy ? 'Ya' : 'Tidak'}`,
    },
    {
      axis: 'Ekonomi',
      risk: econRisk,
      safe: 5 - econRisk,
      detail: `PIR ${pir.toFixed(1)}`,
    },
  ];
};

// Fungsi untuk menghitung fitur turunan dari data mentah sesi screening, digunakan untuk analisis lebih lanjut dan visualisasi
export const computeDerivedFeatures = (data) => {
  const f = (k) => (data[k] !== undefined ? Number(data[k]) : 0);
  const sld012 = f('SLD012') || 7,
    sld013 = f('SLD013') || 7;
  const avgSleep = (sld012 + sld013) / 2;
  const socialJL = Math.abs(sld013 - sld012);
  const pad680 = f('PAD680');
  const sedHrs = pad680 / 60;
  const pad615 = f('PAD615'),
    pad630 = f('PAD630');
  const pad645 = f('PAD645'),
    pad660 = f('PAD660');
  const pad675 = f('PAD675');
  const vigMin = (pad615 + pad660) * 5;
  const modMin = (pad630 + pad645 + pad675) * 5;
  const metMin = vigMin * 8 + modMin * 4;
  const alk111 = f('ALQ111'),
    alk130 = f('ALQ130'),
    alk151 = f('ALQ151');
  const alcoholRisk =
    (alk111 === 1 ? 1 : 0) + (alk151 === 1 ? 1 : 0) + (alk130 > 4 ? 1 : 0);

  // PHQ-9 item
  const phqItems = [
    'DPQ010',
    'DPQ020',
    'DPQ030',
    'DPQ040',
    'DPQ050',
    'DPQ060',
    'DPQ070',
    'DPQ080',
    'DPQ090',
  ];
  const shortSleeper = avgSleep < 6 ? 1 : 0;
  const longSleeper = avgSleep > 9 ? 1 : 0;
  const normalSleeper = !shortSleeper && !longSleeper ? 1 : 0;
  const meetsPA = metMin >= 500 ? 1 : 0;
  const inactive = metMin < 150 ? 1 : 0;
  const sedHigh = sedHrs > 8 ? 1 : 0;
  const marital = f('MARITAL');
  const livingAlone = marital === 3 ? 1 : 0;
  const slq050 = f('SLQ050');
  const slq040 = f('SLQ040');
  const slq030 = f('SLQ030');
  const slq120 = f('SLQ120');
  const sleepDisordered = slq050 === 1 ? 1 : 0;
  const sleepApnea = slq040 >= 3 ? 1 : 0;
  const unrfq = slq120;
  const sleepRisk =
    (shortSleeper ? 1 : 0) +
    (sleepDisordered ? 2 : 0) +
    (sleepApnea ? 1 : 0) +
    (slq030 >= 3 ? 0.5 : 0) +
    (unrfq >= 5 ? 0.5 : 0);
  const drinkFreq = f('ALQ121');
  const avgDrinks = alk130;
  const bingeDrinker = alk151 === 1 ? 1 : 0;
  const heavyDrinker = alk130 > 4 ? 1 : 0;
  const sleepXInactive = socialJL * inactive;
  const alcoholXSed = alcoholRisk * sedHrs;
  const lonelyProxy = livingAlone + (marital === 5 ? 1 : 0);
  const sleepAlcSum = sleepRisk + alcoholRisk;
  const pir = f('PIR') || 2.5;
  const incomeBinary = pir < 1.5 ? 1 : 0;
  const educOrd = f('EDUCATION') || 3;
  const maritalBinary = marital === 1 || marital === 6 ? 1 : 0;
  const alcoholEver = alk111 === 1 ? 1 : 0;
  const alcoholCurrent = alk111 === 1 && drinkFreq > 0 ? 1 : 0;
  const logMet = Math.log(Math.max(1, metMin) + 1);
  const sleepCatOrd = shortSleeper ? 0 : longSleeper ? 2 : 1;
  const ageSleep = f('AGE') * avgSleep;
  const pirInactive = pir * inactive;
  const totalRisk =
    sleepRisk +
    alcoholRisk +
    (inactive ? 2 : 0) +
    (sedHrs > 8 ? 1 : 0) +
    (lonelyProxy > 0 ? 1 : 0) +
    (incomeBinary ? 1.5 : 0);
  const activeFemalYoung =
    f('GENDER') === 2 && f('AGE') < 35 && meetsPA ? 1 : 0;
  const nSevereItems = phqItems.filter((k) => f(k) === 3).length;
  const weightMec = 80000;

  return {
    ...data,
    AVG_SLEEP_HOURS: avgSleep,
    SLEEP_DEVIATION: Math.abs(avgSleep - 7.5),
    SOCIAL_JETLAG: socialJL,
    SHORT_SLEEPER: shortSleeper,
    LONG_SLEEPER: longSleeper,
    NORMAL_SLEEPER: normalSleeper,
    SLEEP_DISORDERED: sleepDisordered,
    SLEEP_APNEA_RISK: sleepApnea,
    UNRESTED_FREQ: unrfq,
    SLEEP_RISK_SCORE: sleepRisk,
    VIG_MIN_WEEK: vigMin,
    MOD_MIN_WEEK: modMin,
    TOTAL_MET_MIN: metMin,
    SEDENTARY_HOURS: sedHrs,
    SEDENTARY_HIGH: sedHigh,
    MEETS_PA_GUIDELINE: meetsPA,
    PHYSICALLY_INACTIVE: inactive,
    ALCOHOL_EVER: alcoholEver,
    ALCOHOL_CURRENT: alcoholCurrent,
    DRINK_FREQ_SCORE: drinkFreq,
    AVG_DRINKS_DAY: avgDrinks,
    BINGE_DRINKER: bingeDrinker,
    HEAVY_DRINKER: heavyDrinker,
    ALCOHOL_RISK_SCORE: alcoholRisk,
    TOTAL_RISK_COMPOSITE: totalRisk,
    SLEEP_X_INACTIVE: sleepXInactive,
    ALCOHOL_X_SEDENTARY: alcoholXSed,
    LONELINESS_PROXY: lonelyProxy,
    SLEEP_ALCOHOL_SUM: sleepAlcSum,
    LIVING_ALONE: livingAlone,
    MARITAL_BINARY: maritalBinary,
    INCOME_BINARY: incomeBinary,
    EDUCATION_ORD: educOrd,
    GENDER_F: f('GENDER') === 2 ? 1 : 0,
    LOG_MET: logMet,
    SLEEP_CAT_ORDINAL: sleepCatOrd,
    AGE_SLEEP_INTERACT: ageSleep,
    PIR_INACTIVE: pirInactive,
    ACTIVE_FEMALE_YOUNG: activeFemalYoung,
    N_SEVERE_ITEMS: nSevereItems,
    WEIGHT_MEC: weightMec,
  };
};

// Pertanyaan PHQ-9
export const PHQ9_QUESTIONS = [
  {
    key: 'DPQ010',
    label:
      'Kurang minat atau kesenangan dalam melakukan hal-hal yang biasanya Anda nikmati',
    note: 'Anhedonia - kehilangan rasa senang (pleasure). Indikator utama depresi mayor.',
  },
  {
    key: 'DPQ020',
    label: 'Merasa sedih, murung, atau tidak punya harapan',
    note: 'Depressed mood / hopelessness. Bersama DPQ010, keduanya adalah kriteria inti DSM-5.',
  },
  {
    key: 'DPQ030',
    label:
      'Sulit tidur, tidak bisa tidur nyenyak, atau malah tidur terlalu banyak',
    note: 'Insomnia atau hipersomnia - gangguan tidur terkait depresi.',
  },
  {
    key: 'DPQ040',
    label: 'Merasa lelah atau tidak punya tenaga',
    note: 'Fatigue / anergia - kelelahan yang tidak proporsional dengan aktivitas.',
  },
  {
    key: 'DPQ050',
    label: 'Nafsu makan buruk atau makan berlebihan',
    note: 'Appetite change - perubahan pola makan signifikan tanpa alasan fisik.',
  },
  {
    key: 'DPQ060',
    label:
      'Merasa buruk tentang diri sendiri atau merasa diri sendiri dan kecewa',
    note: 'Worthlessness / guilt - perasaan tidak berharga, rasa bersalah berlebihan.',
  },
  {
    key: 'DPQ070',
    label:
      'Sulit berkonsentrasi pada sesuatu, seperti membaca koran atau menonton televisi',
    note: 'Concentration difficulty - gangguan kognitif eksekutif.',
  },
  {
    key: 'DPQ080',
    label:
      'Bergerak atau berbicara sangat lambat sehingga orang lain memperhatikan atau sebaliknya sangat gelisah/tidak bisa diam',
    note: 'Concentration difficulty - gangguan kognitif eksekutif. Mencerminkan disfungsi korteks prefrontal yang melemahkan working memory.',
  },
  {
    key: 'DPQ090',
    label:
      'Mempunyai pikiran bahwa lebih baik mati, atau ingin menyakiti diri sendiri',
    note: 'Suicidal ideation - pikiran tentang kematian atau menyakiti diri sendiri. Nilai >0 memerlukan perhatian klinis segera.',
    sensitive: true,
  },
];

export const PHQ9_OPTIONS = [
  { value: 0, label: 'Tidak sama sekali' },
  { value: 1, label: 'Beberapa hari' },
  { value: 2, label: 'Lebih dari separuh hari' },
  { value: 3, label: 'Hampir setiap hari' },
];
