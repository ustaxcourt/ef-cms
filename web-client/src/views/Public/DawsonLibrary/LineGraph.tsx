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
  width = 600,
  height = 400,
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
            backgroundColor: `${color}33`, // 20% opacity fill
            borderWidth: 2,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            // fill: true,
            tension: 0,
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: !!title,
            text: title,
            font: {
              size: 18,
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
                size: 12,
                weight: 'bold',
              },
              usePointStyle: true,
              pointStyle: 'rectRounded',
              boxWidth: 24,
              boxHeight: 14,
              borderRadius: 6,
              color: '#000',
              borderColor: '#000',
              borderWidth: 2,
            },
          },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'line'>) => {
                return ` ${context.dataset.label}: ${context.parsed.y}`;
              },
            },
          },
          datalabels: {
            display: false,
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
              font: {
                size: 13,
                weight: 'bold',
              },
            },
            ticks: {
              font: {
                size: 12,
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
              font: {
                size: 13,
                weight: 'bold',
              },
            },
            ticks: {
              font: {
                size: 12,
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
