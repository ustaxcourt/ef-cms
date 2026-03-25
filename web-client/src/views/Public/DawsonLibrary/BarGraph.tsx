import React, { useEffect, useRef } from 'react';
import {
  Chart,
  ChartConfiguration,
  registerables,
  TooltipItem,
} from 'chart.js';

Chart.register(...registerables);

// ─── Single-dataset bar graph ─────────────────────────────────────────────────

export interface BarGraphData {
  label: string;
  value: number;
  color?: string;
}

export interface SingleBarGraphProps {
  data: BarGraphData[];
  title?: string;
  width?: number;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

// ─── Multi-dataset bar graph (stacked or grouped) ─────────────────────────────

export interface BarGraphDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface MultiBarGraphProps {
  datasets: BarGraphDataset[];
  labels: string[];
  title?: string;
  width?: number;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  stacked?: boolean;
}

const defaultColors = [
  '#005EA2', // blue primary
  '#FFBE2E', // yellow primary
];

export const SingleBarGraph: React.FC<SingleBarGraphProps> = ({
  data,
  title,
  width = 600,
  height = 400,
  showLegend = false,
  showGrid = true,
  xAxisLabel,
  yAxisLabel,
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

    const colors = data.map(
      (item, index) =>
        item.color || defaultColors[index % defaultColors.length],
    );

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: data.map(item => item.label),
        datasets: [
          {
            label: title || 'Value',
            data: data.map(item => item.value),
            backgroundColor: colors,
            borderColor: colors.map(c => `${c}cc`),
            borderWidth: 1,
            borderRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: !!title,
            text: title,
            font: { size: 18, weight: 'bold' },
            padding: { top: 10, bottom: 20 },
          },
          legend: { display: showLegend },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'bar'>) =>
                ` ${context.label}: ${context.parsed.y}`,
            },
          },
          datalabels: {
            display: true,
            anchor: 'center',
            align: 'center',
            color: '#ffffff',
            font: { size: 13, weight: 'bold' },
            formatter: (value: number) => value,
          },
        },
        scales: {
          x: {
            grid: { display: showGrid },
            title: {
              display: !!xAxisLabel,
              text: xAxisLabel,
              font: { size: 13, weight: 'bold' },
            },
            ticks: { font: { size: 12 } },
          },
          y: {
            grid: { display: showGrid },
            title: {
              display: !!yAxisLabel,
              text: yAxisLabel,
              font: { size: 13, weight: 'bold' },
            },
            ticks: { font: { size: 12 } },
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
  }, [data, title, showLegend, showGrid, xAxisLabel, yAxisLabel]);

  return (
    <div
      style={{
        height: `${height}px`,
        position: 'relative',
        width: `${width}px`,
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};

// ─── MultiBarGraph (stacked or grouped) ──────────────────────────────────────

export const MultiBarGraph: React.FC<MultiBarGraphProps> = ({
  datasets,
  labels,
  title,
  width = 600,
  height = 400,
  showLegend = true,
  showGrid = true,
  xAxisLabel,
  yAxisLabel,
  stacked = false,
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

    // Calculate the max value across all labels to give y-axis breathing room.
    // For stacked charts sum all datasets per label; for grouped use the single max.
    const labelCount = labels.length;
    let maxValue = 0;
    for (let i = 0; i < labelCount; i++) {
      const total = stacked
        ? datasets.reduce((sum, ds) => sum + ((ds.data[i] as number) || 0), 0)
        : Math.max(...datasets.map(ds => (ds.data[i] as number) || 0));
      if (total > maxValue) maxValue = total;
    }
    const yMax = Math.ceil(maxValue * 1.1);

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels,
        datasets: datasets.map((dataset, index) => {
          const color =
            dataset.color || defaultColors[index % defaultColors.length];
          return {
            label: dataset.label,
            data: dataset.data,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            borderRadius: 0,
            stack: stacked ? 'stack' : undefined,
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
            font: { size: 18, weight: 'bold' },
            padding: { top: 10, bottom: 20 },
          },
          legend: {
            display: showLegend,
            position: 'top',
            onClick: () => {},
            labels: {
              padding: 15,
              font: { size: 12, weight: 'bold' },
              usePointStyle: true,
              pointStyle: 'rectRounded',
              boxWidth: 24,
              boxHeight: 14,
              borderRadius: 6,
              color: '#000',
            },
          },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'bar'>) =>
                ` ${context.dataset.label}: ${context.parsed.y}`,
            },
          },
          datalabels: {
            display: true,
            anchor: (context: any) => {
              const value = context.dataset.data[context.dataIndex] as number;
              const labelIndex = context.dataIndex;
              const colTotal = datasets.reduce(
                (sum, ds) => sum + ((ds.data[labelIndex] as number) || 0),
                0,
              );
              return value / colTotal < 0.1 ? 'end' : 'center';
            },
            align: (context: any) => {
              const value = context.dataset.data[context.dataIndex] as number;
              const labelIndex = context.dataIndex;
              const colTotal = datasets.reduce(
                (sum, ds) => sum + ((ds.data[labelIndex] as number) || 0),
                0,
              );
              return value / colTotal < 0.1 ? 'end' : 'center';
            },
            color: (context: any) => {
              const value = context.dataset.data[context.dataIndex] as number;
              const labelIndex = context.dataIndex;
              const colTotal = datasets.reduce(
                (sum, ds) => sum + ((ds.data[labelIndex] as number) || 0),
                0,
              );
              const isOutside = value / colTotal < 0.1;
              if (isOutside) return '#000000';
              const { datasetIndex } = context;
              const color =
                datasets[datasetIndex]?.color ||
                defaultColors[datasetIndex % defaultColors.length];
              // Yellow (#FFBE2E) gets black text, everything else gets white
              return color.toUpperCase() === '#FFBE2E' ? '#000000' : '#ffffff';
            },
            font: { size: 11, weight: 'bold' },
            textAlign: 'center',
            clamp: true,
            formatter: (value: number, context: any) => {
              if (!stacked) return `${value}`;
              const datasetLabel = datasets[context.datasetIndex]?.label ?? '';
              const labelIndex = context.dataIndex;
              const colTotal = datasets.reduce(
                (sum, ds) => sum + ((ds.data[labelIndex] as number) || 0),
                0,
              );
              const isSmall = value / colTotal < 0.1;
              if (!isSmall) {
                return `${value}\n${datasetLabel}`;
              }
              return `${value}`;
            },
          },
        },
        scales: {
          x: {
            stacked,
            grid: { display: showGrid },
            title: {
              display: !!xAxisLabel,
              text: xAxisLabel,
              font: { size: 13, weight: 'bold' },
            },
            ticks: { font: { size: 12 } },
          },
          y: {
            stacked,
            max: yMax,
            grid: { display: showGrid },
            title: {
              display: !!yAxisLabel,
              text: yAxisLabel,
              font: { size: 13, weight: 'bold' },
            },
            ticks: { font: { size: 12 } },
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
    stacked,
  ]);

  return (
    <div
      style={{
        height: `${height}px`,
        position: 'relative',
        width: `${width}px`,
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};
