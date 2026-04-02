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
  /** Optional color for the chart title text */
  titleColor?: string;
  /** Optional color for the datalabels */
  datalabelColor?: string;
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
  /** Optional: force x-axis label rotation in degrees (overrides stacked/grouped defaults) */
  xLabelRotation?: number;
}

const defaultColors = [
  '#005EA2', // blue primary
  '#FFBE2E', // yellow primary
];

export const SingleBarGraph: React.FC<SingleBarGraphProps> = ({
  data,
  title,
  width = 1344,
  height = 800,
  showLegend = false,
  showGrid = true,
  xAxisLabel,
  yAxisLabel,
  titleColor = '#000',
  datalabelColor = '#fff',
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
        events: ['click'],
        plugins: {
          title: {
            display: !!title,
            text: title,
            color: titleColor,
            font: { size: 20, weight: 'bold' },
            padding: { top: 10, bottom: 20 },
          },
          legend: { display: showLegend },
          tooltip: {
            enabled: false,
            callbacks: {
              label: (context: TooltipItem<'bar'>) =>
                ` ${context.label}: ${context.parsed.y}`,
            },
          },
          datalabels: {
            display: true,
            anchor: 'center',
            align: 'center',
            color: datalabelColor,
            font: { size: 20, weight: 'bold' },
            formatter: (value: number) => value,
          },
        },
        scales: {
          x: {
            grid: { display: showGrid },
            title: {
              display: !!xAxisLabel,
              text: xAxisLabel,
              font: { size: 20, weight: 'bold' },
            },
            ticks: { font: { size: 20 } },
          },
          y: {
            grid: { display: showGrid },
            title: {
              display: !!yAxisLabel,
              text: yAxisLabel,
              font: { size: 20, weight: 'bold' },
            },
            ticks: { font: { size: 20 } },
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
  width = 1344,
  height = 800,
  showLegend = true,
  showGrid = true,
  xAxisLabel,
  yAxisLabel,
  stacked = false,
  xLabelRotation,
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
            borderColor: stacked ? color : '#000',
            borderWidth: stacked ? 1 : 1,
            borderRadius: 0,
            stack: stacked ? 'stack' : undefined,
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
            font: { size: 20, weight: 'bold' },
            padding: { top: 10, bottom: 20 },
          },
          legend: {
            display: showLegend,
            position: 'top',
            onClick: () => {},
            labels: {
              padding: 15,
              font: { size: 20, weight: 'bold' },
              usePointStyle: false,
              boxWidth: 48,
              boxHeight: 48,
              borderRadius: 6,
              color: '#000',
              generateLabels: chart => {
                const ds = chart.data.datasets as any[];
                return (
                  ds?.map((dataset, i) => {
                    const fill =
                      dataset?.backgroundColor ||
                      defaultColors[i % defaultColors.length];
                    return {
                      text: dataset?.label || `Dataset ${i + 1}`,
                      fillStyle: fill,
                      strokeStyle: '#000',
                      lineWidth: 1,
                      borderRadius: 6,
                      datasetIndex: i,
                    };
                  }) || []
                );
              },
            } as any,
          },
          tooltip: {
            enabled: false,
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
              const isSmallBar = value / colTotal < 0.1;
              if (!stacked) return isSmallBar ? '#000000' : '#ffffff';
              return value / colTotal < 0.15 ? '#000000' : '#ffffff';
            },
            rotation: stacked ? 0 : -90,
            font: { size: 20, weight: 'bold' },
            textAlign: 'center',
            clamp: true,
            formatter: (value: number, context: any) => {
              const datasetLabel = datasets[context.datasetIndex]?.label ?? '';
              const labelIndex = context.dataIndex;
              const colTotal = datasets.reduce(
                (sum, ds) => sum + ((ds.data[labelIndex] as number) || 0),
                0,
              );
              const isSmall = value / colTotal < 0.1;

              // For stacked charts: show dataset label only when bar is not small
              if (stacked) {
                if (!isSmall) return `${value}\n${datasetLabel}`;
                return `${value}`;
              }

              // For grouped charts: if the label is outside and it's the 'Closed' (yellow) bar,
              // include the dataset label so the text clarifies what the value refers to.
              return `${value} ${datasetLabel}`;
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
              color: '#000',
              font: { size: 20, weight: 'bold' },
            },
            ticks: (() => {
              let rotationVal: number;
              if (typeof xLabelRotation === 'number') {
                rotationVal = xLabelRotation;
              } else {
                rotationVal = stacked ? 0 : 45;
              }

              let autoSkipVal: boolean;
              if (typeof xLabelRotation === 'number') {
                autoSkipVal = false;
              } else {
                autoSkipVal = stacked;
              }

              return {
                color: '#000',
                font: { size: 20 },
                autoSkip: autoSkipVal,
                minRotation: rotationVal,
                maxRotation: rotationVal,
              };
            })(),
          },
          y: {
            stacked,
            max: yMax,
            grid: { display: showGrid },
            title: {
              display: !!yAxisLabel,
              text: yAxisLabel,
              color: '#000',
              font: { size: 20, weight: 'bold' },
            },
            ticks: { color: '#000', font: { size: 20 } },
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
