import React, { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { Context } from 'chartjs-plugin-datalabels';

Chart.register(...registerables, ChartDataLabels);

export interface PieGraphData {
  label: string;
  value: number;
  color?: string;
}

interface PieGraphProps {
  data: PieGraphData[];
  title?: string;
  width?: number;
  height?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  /**
   * Outline option for pie slices. 'none' -> no border; 'white' -> white border; 'black' -> black border (default)
   */
  outline?: 'none' | 'white' | 'black';
}

export const PieGraph: React.FC<
  PieGraphProps & { type?: 'default' | 'session'; rotation?: number }
> = ({
  data,
  type = 'default',
  rotation = 0, // -90 makes the pie chart start from the top aka 12 o clock position instead of default right 3 o clock
  title = 'Distribution',
  width = 400,
  height = 400,
  showLegend = true,
  showLabels = true,
  outline = 'black',
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const defaultColors =
    type === 'default'
      ? [
          '#005EA2', // blue primary
          '#FFBE2E', // yellow
          '#162E51', // blue darker
          '#D83933', // red primary
          '#2E8540', // green
          '#E5A000', // yellow darker
          '#B50909', // red darker
        ]
      : [
          '#B4D0B9', // light green
          '#FEE685', // light yellow
          '#97D4EA', // light blue
          '#F2938C', // light red
          '#D0C3E9', // light purple
          '#E5A000', // yellow darker
        ];

  const isLightColor = (hexColor: string): boolean => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);
    const colors = data.map(
      (item, index) =>
        item.color || defaultColors[index % defaultColors.length],
    );

    const total = values.reduce((sum, val) => sum + val, 0);

    const borderColor =
      outline === 'none' ? undefined : outline === 'white' ? '#fff' : '#000';
    const borderWidth = outline === 'none' ? 0 : 2;

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderColor,
            borderWidth,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation, // Start from top (default is 0, which starts from right)
        // only allow click events to avoid hover interactions/tooltips
        events: ['click'],
        plugins: {
          title: {
            display: !!title,
            text: title,
            color: '#000',
            font: {
              size: 24,
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
              usePointStyle: false,
              boxWidth: 20,
              boxHeight: 20,
              borderRadius: 6,
              generateLabels: chart => {
                const { datasets } = chart.data;
                if (datasets.length === 0) return [];
                return (
                  chart.data.labels?.map((label, i) => {
                    const value = datasets[0].data[i] as number;
                    const bgColor = (datasets[0].backgroundColor as string[])[
                      i
                    ];
                    return {
                      text: `${label}: ${value}`,
                      fillStyle: bgColor,
                      strokeStyle: '#000',
                      borderRadius: 6,
                      index: i,
                    };
                  }) || []
                );
              },
            },
          },
          tooltip: {
            enabled: false,
            callbacks: {
              label: context => {
                const label = context.label || '';
                const value = context.parsed;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
          datalabels: {
            display: showLabels,
            color: (context: Context) => {
              const bgColor = colors[context.dataIndex] || defaultColors[0];
              return isLightColor(bgColor) ? '#000' : '#fff';
            },
            font: {
              weight: 'bold' as const,
              size: 14,
            },
            formatter: (value: number) => {
              const percentage = ((value / total) * 100).toFixed(1);
              return `${percentage}%`;
            },
            anchor: (context: Context) => {
              const percentage =
                ((context.dataset.data[context.dataIndex] as number) / total) *
                100;
              return percentage < 5 ? 'end' : 'center';
            },
            align: (context: Context) => {
              const percentage =
                ((context.dataset.data[context.dataIndex] as number) / total) *
                100;
              return percentage < 5 ? 'end' : 'center';
            },
            offset: (context: Context) => {
              const percentage =
                ((context.dataset.data[context.dataIndex] as number) / total) *
                100;
              return percentage < 5 ? 10 : 0;
            },
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
  }, [data, title, showLegend, showLabels]);

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
