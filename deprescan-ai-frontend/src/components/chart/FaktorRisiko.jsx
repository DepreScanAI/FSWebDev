import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip as ChartTooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartLabel from '../label/ChartLabel';
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip);

const n = (v, d = 0) => {
  const p = parseFloat(v);
  return isNaN(p) ? d : p;
};

export default function FaktorRisiko({ inputData = {}, phqScore = 0 }) {
  const riskData = useMemo(() => {
    const f = (k, d = 0) => n(inputData?.[k], d);

    const phqTotal = parseFloat(phqScore) || 0;

    return [
      {
        label: 'Sedentary hours',
        value: f('SEDENTARY_HOURS'),
        color: '#f4a66a',
      },
      {
        label: 'Inactive flag',
        value: f('PHYSICALLY_INACTIVE'),
        color: '#f4a66a',
      },
      {
        label: 'PHQ-9 total',
        value: phqTotal,
        color: '#9ab8e8',
      },
      {
        label: 'Social jetlag',
        value: f('SOCIAL_JETLAG'),
        color: '#9ab8e8',
      },
      {
        label: 'Composite risk',
        value: f('TOTAL_RISK_COMPOSITE'),
        color: '#9ab8e8',
      },
      {
        label: 'Sleep risk',
        value: f('SLEEP_RISK_SCORE'),
        color: '#9ab8e8',
      },
    ];
  }, [inputData, phqScore]);

  const maxVal = Math.max(...riskData.map((d) => d.value), 1);
  const xMax = Math.max(Math.ceil(maxVal / 5) * 5, 5);

  const chartData = {
    labels: riskData.map((d) => d.label),
    datasets: [
      {
        data: riskData.map((d) => d.value),
        backgroundColor: riskData.map((d) => d.color),
        borderRadius: { topRight: 4, bottomRight: 4 },
        barPercentage: 0.5,
        categoryPercentage: 1.0,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: xMax,
        grid: { color: '#dde3f0', drawTicks: false },
        border: { display: false },
        ticks: {
          stepSize: 5,
          color: '#94a3b8',
          font: { size: 11, family: 'inherit' },
          padding: 8,
        },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#64748b',
          font: { size: 11, family: 'inherit' },
          padding: 8,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 12,
        padding: { top: 8, bottom: 8, left: 12, right: 12 },
        titleColor: '#374151',
        bodyColor: '#4b5563',
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => `Skor: ${tooltipItem.raw}`,
        },
        titleFont: { size: 14, weight: '600', family: 'inherit' },
        bodyFont: { size: 12, weight: '600', family: 'inherit' },
        bodySpacing: 4,
        titleMarginBottom: 4,
      },
    },
  };

  return (
    <div className="card p-6 mb-6 h-full">
      <ChartLabel>Kontribusi Faktor Risiko Utama</ChartLabel>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '280px',
          marginTop: '1rem',
        }}
      >
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

FaktorRisiko.propTypes = {
  inputData: PropTypes.object,
  phqScore: PropTypes.number,
};
