import React, { useEffect, useRef } from 'react';
import {
  Chart,
  ChartConfiguration,
  registerables,
  TooltipItem,
} from 'chart.js';

Chart.register(...registerables);

export interface LineGraphDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface LineGraphProps {
  datasets: LineGraphDataset[];
  labels: string[];
  title?: string;
  width?: number;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  smooth?: boolean;
}

const defaultColors = [
  '#005EA2', // blue primary
  '#162E51', // blue darker
  '#D83933', // red primary
  '#2E8540', // green
  '#B50909', // red darker
];

export const LineGraph: React.FC<LineGraphProps> = ({
  datasets,
  labels,
  title,
  width = 1344,
  height = 800,
  showLegend = true,
  showGrid = true,
  xAxisLabel,
  yAxisLabel,
  smooth = false,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map((dataset, index) => {
          const color =
            dataset.color || defaultColors[index % defaultColors.length];
          return {
            label: dataset.label,
            data: dataset.data,
            borderColor: color,
            backgroundColor: `${color}33`,
            borderWidth: 2,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0,
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        events: ['click'],
        plugins: {
          title: {
            display: !!title,
            text: title,
            color: '#000',
            font: {
              size: 20,
              weight: 'bold',
            },
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          legend: {
            display: showLegend,
            position: 'top',
            onClick: () => {},
            labels: {
              padding: 15,
              font: {
                size: 20,
                weight: 'bold',
              },
              usePointStyle: true,
              pointStyle: 'rectRounded',
              boxWidth: 48,
              boxHeight: 48,
              borderRadius: 6,
              color: '#000',
            },
          },
          tooltip: {
            enabled: false,
            callbacks: {
              label: (context: TooltipItem<'line'>) => {
                return ` ${context.dataset.label}: ${context.parsed.y}`;
              },
            },
          },
          datalabels: {
            display: false,
            font: { size: 20 },
          },
        },
        scales: {
          x: {
            grid: {
              display: showGrid,
            },
            title: {
              display: !!xAxisLabel,
              text: xAxisLabel,
              color: '#000',
              font: {
                size: 20,
                weight: 'bold',
              },
            },
            ticks: {
              color: '#000',
              font: {
                size: 20,
              },
            },
          },
          y: {
            grid: {
              display: showGrid,
            },
            title: {
              display: !!yAxisLabel,
              text: yAxisLabel,
              color: '#000',
              font: {
                size: 20,
                weight: 'bold',
              },
            },
            ticks: {
              color: '#000',
              font: {
                size: 20,
              },
            },
            beginAtZero: true,
          },
        },
      },
    };

    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [
    datasets,
    labels,
    title,
    showLegend,
    showGrid,
    xAxisLabel,
    yAxisLabel,
    smooth,
  ]);

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};
