import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({ results }) {
  const labels = [
    results.serotonin.name,
    results.dopamine.name,
    results.noradrenaline.name,
    results.gaba.name,
  ];

  const values = [
    results.serotonin.value * 100,
    results.dopamine.value * 100,
    results.noradrenaline.value * 100,
    results.gaba.value * 100,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Нейротрансмиттерный профиль',
        data: values,
        backgroundColor: 'rgba(255, 0, 255, 0.15)',
        borderColor: '#ff00ff',
        borderWidth: 2,
        pointBackgroundColor: '#ff00aa',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ff00ff',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(217, 70, 239, 0.2)',
        },
        grid: {
          color: 'rgba(217, 70, 239, 0.2)',
        },
        pointLabels: {
          font: {
            size: 14,
            weight: '600',
            family: "'Century Gothic', sans-serif",
          },
          color: '#d946ef',
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 10,
          },
          color: '#9CA3AF',
          backdropColor: 'transparent',
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}
