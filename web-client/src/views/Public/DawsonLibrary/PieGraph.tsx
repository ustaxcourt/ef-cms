import React, { useEffect, useRef } from 'react';
import {
  Chart,
  ChartConfiguration,
  ChartEvent,
  LegendElement,
  LegendItem,
  registerables,
} from 'chart.js';
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
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Default color palette
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

  // Helper function to determine if a color is light or dark
  const isLightColor = (hexColor: string): boolean => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare data
    const labels = data.map(item => item.label);
    const values = data.map(item => item.value);
    const colors = data.map(
      (item, index) =>
        item.color || defaultColors[index % defaultColors.length],
    );

    // Calculate total for percentages
    const total = values.reduce((sum, val) => sum + val, 0);

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderColor: '#000',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation, // Start from top (default is 0, which starts from right)
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
            onClick: (
              _: ChartEvent,
              legendItem: LegendItem,
              legend: LegendElement<'pie'>,
            ) => {
              const { index } = legendItem;
              const { chart } = legend;
              const { data: metaData } = chart.getDatasetMeta(0);
              if (index === undefined) return;
              const item = metaData[index];
              item.hidden = !item.hidden;
              chart.update();
            },
            labels: {
              padding: 15,
              font: {
                size: 12,
                weight: 'bold',
              },
              usePointStyle: false,
              boxWidth: 20,
              boxHeight: 20,
              generateLabels: chart => {
                const { datasets } = chart.data;
                if (datasets.length === 0) return [];

                return (
                  chart.data.labels?.map((label, i) => {
                    const value = datasets[0].data[i] as number;
                    const meta = chart.getDatasetMeta(0);
                    const isHidden =
                      (meta.data[i] as unknown as { hidden: boolean })
                        ?.hidden ?? false;
                    const bgColor = (datasets[0].backgroundColor as string[])[
                      i
                    ];
                    return {
                      text: `${label}: ${value}`,
                      fillStyle: isHidden ? '#ccc' : bgColor,
                      strokeStyle: isHidden ? '#999' : bgColor,
                      fontColor: isHidden ? '#999' : undefined,
                      textDecoration: isHidden ? 'line-through' : undefined,
                      hidden: isHidden,
                      index: i,
                    };
                  }) || []
                );
              },
            },
          },
          tooltip: {
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
