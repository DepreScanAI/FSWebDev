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
import { CAT_META, computeCategoryRows } from '../../utils/hasilConstants';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip);

export default function CompareModels({ phqScore, activeCategory }) {
  const rows = useMemo(
    () => computeCategoryRows(phqScore, activeCategory),
    [phqScore, activeCategory],
  );

  const mappedData = rows.map((row) => {
    const meta = CAT_META[row.cat];
    return {
      label: meta.label,
      value: row.phqEst ? parseFloat(row.phqEst) : 0,
      baseColor: meta.color,
      isActive: row.isActive, // gunakan isActive dari computeCategoryRows (ground truth backend)
    };
  });

  const maxValue = Math.max(...mappedData.map((d) => d.value), phqScore);
  const yMax = Math.max(Math.ceil(maxValue / 5) * 5, 15);

  const chartData = {
    labels: mappedData.map((d) => d.label),
    datasets: [
      {
        data: mappedData.map((d) => d.value),
        backgroundColor: mappedData.map((d) =>
          d.isActive ? d.baseColor : `${d.baseColor}66`,
        ),
        borderRadius: { topLeft: 5, topRight: 5 },
        barPercentage: 0.7,
        categoryPercentage: 1.0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#94a3b8',
          font: { size: 11, family: 'inherit' },
        },
      },
      y: {
        min: 0,
        max: yMax,
        grid: {
          color: '#dde3f0',
          drawTicks: false,
        },
        border: { display: false },
        ticks: {
          stepSize: 5,
          color: '#94a3b8',
          font: { size: 11, family: 'inherit' },
          padding: 8,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#374151',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 12,
        padding: { top: 8, bottom: 8, left: 12, right: 12 },
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => `PHQ-9: ${tooltipItem.raw}`,
        },
        titleFont: {
          size: 14,
          weight: '600',
          family: 'inherit',
        },
        bodyFont: {
          size: 12,
          weight: '600',
          family: 'inherit',
        },
        bodySpacing: 4,
        titleMarginBottom: 4,
      },
    },
  };

  return (
    <div className="card p-6 mb-6 h-full">
      <div className="flex items-start justify-between mb-3">
        <ChartLabel>Komparasi Model – Live Plot</ChartLabel>
        <span className="text-xs text-gray-400 font-medium tabular-nums">
          PHQ-9:{' '}
          <strong className="text-gray-600 font-semibold">{phqScore}</strong>
        </span>
      </div>

      {activeCategory && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full text-xs font-semibold bg-white border border-brand-200 text-gray-600">
          Konsensus:{' '}
          <strong className="text-brand-500">{activeCategory}</strong>
        </span>
      )}

      <div style={{ position: 'relative', width: '100%', height: '240px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

CompareModels.propTypes = {
  phqScore: PropTypes.number.isRequired,
  activeCategory: PropTypes.string.isRequired,
};
