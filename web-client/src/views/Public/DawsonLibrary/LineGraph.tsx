import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Dot,
} from 'recharts';

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

// ─── Custom legend renderer ───────────────────────────────────────────────────

const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'flex-start',
        padding: '8px 0 16px',
      }}
    >
      {payload.map((entry: any, index: number) => (
        <div
          key={index}
          style={{ alignItems: 'center', display: 'flex', gap: '8px' }}
        >
          <div
            style={{
              backgroundColor: entry.color,
              border: '1px solid #000',
              borderRadius: '6px',
              flexShrink: 0,
              height: '48px',
              width: '48px',
            }}
          />
          <span style={{ color: '#000', fontSize: '20px', fontWeight: 'bold' }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── LineGraph ────────────────────────────────────────────────────────────────

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
  // Build recharts row-oriented data: [{ name: 'Jan', 'Regular Cases': 55, ... }, ...]
  const chartData = labels.map((label, i) => {
    const row: Record<string, any> = { name: label };
    datasets.forEach(ds => {
      row[ds.label] = ds.data[i] ?? null;
    });
    return row;
  });

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      {title && (
        <div
          style={{
            color: '#000',
            fontSize: '20px',
            fontWeight: 'bold',
            padding: '10px 0 8px',
            paddingLeft: '80px',
            textAlign: 'left',
          }}
        >
          {title}
        </div>
      )}
      {showLegend && (
        <div style={{ paddingLeft: '80px' }}>
          {renderCustomLegend({
            payload: datasets.map((ds, i) => ({
              color: ds.color || defaultColors[i % defaultColors.length],
              value: ds.label,
            })),
          })}
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            bottom: xAxisLabel ? 40 : 10,
            left: 20,
            right: 30,
            top: 10,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis
            dataKey="name"
            tick={{ fill: '#000', fontSize: 20 }}
            label={
              xAxisLabel
                ? {
                    fill: '#000',
                    fontSize: 20,
                    fontWeight: 'bold',
                    offset: -20,
                    position: 'insideBottom',
                    value: xAxisLabel,
                  }
                : undefined
            }
          />
          <YAxis
            tick={{ fill: '#000', fontSize: 20 }}
            label={
              yAxisLabel
                ? {
                    angle: -90,
                    fill: '#000',
                    fontSize: 20,
                    fontWeight: 'bold',
                    offset: 10,
                    position: 'insideLeft',
                    value: yAxisLabel,
                  }
                : undefined
            }
          />
          {datasets.map((ds, index) => {
            const color =
              ds.color || defaultColors[index % defaultColors.length];
            return (
              <Line
                key={ds.label}
                type={smooth ? 'monotone' : 'linear'}
                dataKey={ds.label}
                stroke={color}
                strokeWidth={2}
                dot={<Dot r={5} fill={color} stroke="#fff" strokeWidth={2} />}
                activeDot={{ r: 7 }}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
