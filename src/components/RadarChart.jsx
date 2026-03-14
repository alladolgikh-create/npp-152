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

const scaleColors = ['#ff00ff', '#39ff14', '#00cec9', '#ff6b6b'];

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
        backgroundColor: 'rgba(255, 0, 255, 0.1)',
        borderColor: '#ff00ff',
        borderWidth: 2,
        pointBackgroundColor: scaleColors,
        pointBorderColor: scaleColors,
        pointHoverBackgroundColor: '#0a0a0a',
        pointHoverBorderColor: scaleColors,
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
        backgroundColor: '#1a1a2e',
        titleColor: '#e0e0e0',
        bodyColor: '#e0e0e0',
        borderColor: '#333333',
        borderWidth: 1,
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
          color: '#333333',
        },
        grid: {
          color: '#333333',
        },
        pointLabels: {
          font: {
            size: 14,
            weight: '600',
            family: "'JetBrains Mono', monospace",
          },
          color: scaleColors,
        },
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 10,
          },
          color: '#555555',
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
