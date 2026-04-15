import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Dot,
  Tooltip,
} from 'recharts';

export interface LineGraphDataset {
  label: string;
  data: (number | null)[];
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
  xLabelRotation?: number;
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
              border: '2px solid #000',
              borderRadius: '6px',
              flexShrink: 0,
              height: '48px',
              width: '48px',
            }}
          />
          <span style={{ color: '#000', fontSize: '20px', fontWeight: '600' }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Rotated x-axis tick ────────────────────────────────────────────────────

const RotatedTickX = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={20}
        textAnchor="end"
        fill="#000"
        fontSize={20}
        fontWeight="bold"
        transform="rotate(-45)"
      >
        {payload.value}
      </text>
    </g>
  );
};

const StraightTickX = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={20}
        textAnchor="middle"
        fill="#000"
        fontSize={20}
        fontWeight="600"
      >
        {payload.value}
      </text>
    </g>
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
  xLabelRotation,
  yAxisLabel,
  smooth = false,
}) => {
  // Two data arrays:
  // chartData - uses null for gaps (drives the visible line)
  // tooltipData - uses 0 for nulls (drives the invisible tooltip-trigger line)
  const chartData = labels.map((label, i) => {
    const row: Record<string, any> = { name: label };
    datasets.forEach(ds => {
      row[ds.label] = ds.data[i] ?? null;
    });
    return row;
  });

  const tooltipData = labels.map((label, i) => {
    const row: Record<string, any> = { name: label };
    datasets.forEach(ds => {
      row[`${ds.label}_tip`] = ds.data[i] ?? 0;
    });
    return row;
  });

  // Merge both into one data array for recharts
  const mergedData = chartData.map((row, i) => ({ ...row, ...tooltipData[i] }));

  return (
    <div className="tw:overflow-x-auto">
      <div style={{ width: `${width}px` }}>
        {title && (
          <h2
            style={{
              color: '#000',
              margin: 0,
              padding: '10px 0 8px',
              paddingLeft: '80px',
              textAlign: 'left',
            }}
          >
            {title}
          </h2>
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
        <ResponsiveContainer
          width="100%"
          height={height}
          style={{ outline: 'none' }}
        >
          <LineChart
            data={mergedData}
            margin={{
              bottom: xAxisLabel ? 40 : 10,
              left: 60,
              right: 30,
              top: 10,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <Tooltip
              content={({ active, label }) => {
                if (!active) return null;
                const row = mergedData.find(d => d.name === label);
                if (!row) return null;
                return (
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px 12px',
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 'bold',
                        fontSize: '20px',
                        margin: '0 0 4px',
                      }}
                    >
                      {label}
                    </p>
                    {datasets.map((ds, i) => {
                      const color =
                        ds.color || defaultColors[i % defaultColors.length];
                      return (
                        <div
                          key={ds.label}
                          style={{
                            alignItems: 'center',
                            display: 'flex',
                            gap: '6px',
                            margin: '2px 0',
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: color,
                              border: '1px solid #000',
                              borderRadius: '3px',
                              flexShrink: 0,
                              height: '16px',
                              width: '16px',
                            }}
                          />
                          <span style={{ color: '#000', fontSize: '20px' }}>
                            {ds.label} : {row[`${ds.label}_tip`]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            <XAxis
              dataKey="name"
              height={xLabelRotation ? 120 : 60}
              tick={
                xLabelRotation
                  ? (tickProps: any) => <RotatedTickX {...tickProps} />
                  : (tickProps: any) => <StraightTickX {...tickProps} />
              }
              label={
                xAxisLabel
                  ? {
                      fill: '#000',
                      fontSize: 20,
                      fontWeight: '600',
                      offset: xLabelRotation ? -70 : -20,
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
                      fontWeight: '600',
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
                  strokeWidth={4}
                  dot={(dotProps: any) => {
                    const isNull = dotProps.payload[ds.label] === null;
                    if (isNull) return <g key={dotProps.key} />;
                    return (
                      <Dot
                        key={dotProps.key}
                        {...dotProps}
                        r={5}
                        fill={color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={false}
                  isAnimationActive={false}
                />
              );
            })}
            {/* Invisible lines using _tip keys — fill null gaps so tooltip fires everywhere */}
            {datasets.map(ds => {
              return (
                <Line
                  key={`${ds.label}_tip`}
                  dataKey={`${ds.label}_tip`}
                  stroke="transparent"
                  strokeWidth={0}
                  dot={false}
                  activeDot={false}
                  legendType="none"
                  isAnimationActive={false}
                  hide={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
