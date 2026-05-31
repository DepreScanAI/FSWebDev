import { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { deriveLifestyleMetrics } from '../../utils/helpers';
import ChartLabel from '../label/ChartLabel';
import PropTypes from 'prop-types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

export default function LifestyleRadar({ inputData = {} }) {
  const metrics = useMemo(() => deriveLifestyleMetrics(inputData), [inputData]);

  const data = {
    labels: metrics.map((m) => m.axis),
    datasets: [
      {
        label: 'Zona aman (lebih luar = lebih aman)',
        data: metrics.map((m) => m.safe),
        fill: true,
        backgroundColor: 'rgba(125,211,252,0.20)',
        borderColor: '#38bdf8',
        pointBackgroundColor: '#38bdf8',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 3,
      },
      {
        label: 'Risiko aktual',
        data: metrics.map((m) => m.risk),
        fill: true,
        backgroundColor: 'rgba(251,191,36,0.18)',
        borderColor: '#f59e0b',
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 9,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ctx.datasetIndex === 0
              ? `Aman: ${metrics[ctx.dataIndex]?.safe?.toFixed(2)} / 5`
              : `Risiko: ${metrics[ctx.dataIndex]?.risk?.toFixed(2)} / 5`,
          afterBody: (items) => {
            const m = metrics[items[0]?.dataIndex];
            return m?.detail ? [m.detail] : [];
          },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 5,
        angleLines: { color: 'rgba(42,72,145,0.12)' },
        grid: { color: 'rgba(42,72,145,0.08)' },
        pointLabels: { color: '#374151', font: { size: 13, weight: '600' } },
        ticks: {
          stepSize: 1,
          showLabelBackdrop: false,
          color: '#9ca3af',
          font: { size: 10 },
          callback: (v) => (v === 0 ? 'Risiko' : v === 5 ? 'Max aman' : v),
        },
      },
    },
  };

  return (
    <div className="card mb-6 overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <ChartLabel>Profil Risiko Gaya Hidup – Live Plot</ChartLabel>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* konten kiri*/}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start gap-3 bg-blue-100 rounded-xl p-4">
            <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />
            <p className="text-xs text-gray-600 leading-relaxed">
              Arah sumbu dibuat terbalik secara makna: semakin ke luar semakin
              aman. Semakin ke tengah berarti risikonya lebih tinggi.
            </p>
          </div>
          <div className="space-y-2">
            {metrics.map((m) => {
              const safePct = Math.min(100, Math.max(2, (m.safe / 5) * 100));
              const barColor =
                m.safe >= 3.5 ? '#2a4891' : m.safe >= 2 ? '#ca8a04' : '#e11d48';
              return (
                <div
                  key={m.axis}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-500 font-medium w-20">
                    {m.axis}
                  </span>
                  <div className="flex-1 mx-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${safePct}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                  <span className="text-gray-400 w-12 text-right">
                    {m.safe.toFixed(1)}/5.0
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-semibold mb-1">
              Keterangan bar:
            </p>
            {[
              { color: '#2a4891', label: 'Zona aman ≥ 3.5 - 5' },
              { color: '#ca8a04', label: 'Perlu perhatian 2 – 3.5' },
              { color: '#e11d48', label: 'Risiko tinggi < 2 - 5' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-xs text-gray-500"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </div>
            ))}
          </div>
        </div>
        {/* konten kanan radar status*/}
        <div className="p-6 bg-brand-50/20" style={{ minHeight: 320 }}>
          <Radar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

LifestyleRadar.propTypes = { inputData: PropTypes.object };
