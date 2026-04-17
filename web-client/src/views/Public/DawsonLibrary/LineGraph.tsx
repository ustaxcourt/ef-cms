import React, { useEffect, useState } from 'react';
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
    <div className="tw:flex tw:flex-wrap tw:gap-4 tw:justify-start tw:mb-8">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="tw:flex tw:items-center tw:gap-2">
          <div
            className="tw:shrink-0 tw:border-2 tw:border-black tw:rounded-lg tw:w-12 tw:h-12 tw:max-[480px]:w-10 tw:max-[480px]:h-10"
            style={{ backgroundColor: entry.color }}
          />
          <span className="tw:text-black tw:font-semibold tw:text-xl tw:max-[480px]:text-base">
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
        className="tw:text-xl tw:max-[480px]:text-base tw:font-bold"
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
        className="tw:text-xl tw:max-[480px]:text-base tw:font-semibold"
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
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 480,
  );
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const chartHeight = isMobile ? 600 : height;

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
      {/* tw:max-[480px]:!w-[1000px] overrides the inline width at mobile — confirm 1000px? */}
      <div
        style={{ width: `${width}px` }}
        className="tw:max-[480px]:!w-[1000px]"
      >
        {title && (
          <h2
            className="tw:mt-0 tw:mb-8"
            style={{
              color: '#000',
              textAlign: 'left',
            }}
          >
            {title}
          </h2>
        )}
        {showLegend && (
          <div>
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
          height={chartHeight}
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
              cursor={{ stroke: '#ccc', strokeWidth: 1 }}
              content={({ active, label }) => {
                if (!active) return null;
                const row = mergedData.find(d => d.name === label);
                if (!row) return null;
                return (
                  <div
                    role="status"
                    aria-live="polite"
                    className="tw:bg-white tw:py-2 tw:px-3 tw:flex tw:flex-col tw:border-2 tw:rounded-lg tw:text-black tw:gap-1.5"
                  >
                    <div className="tw:font-bold tw:text-xl tw:max-[480px]:text-base">
                      {label}
                    </div>
                    {datasets.map((ds, i) => {
                      const color =
                        ds.color || defaultColors[i % defaultColors.length];
                      return (
                        <div
                          key={ds.label}
                          className="tw:flex tw:items-center tw:gap-2"
                        >
                          <span
                            className="tw:inline-block tw:w-3.5 tw:h-3.5 tw:shrink-0 tw:border tw:rounded tw:max-[480px]:w-3 tw:max-[480px]:h-3"
                            style={{ backgroundColor: color }}
                          />
                          <span className="tw:text-xl tw:max-[480px]:text-base">
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
              interval={0}
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
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      offset: xLabelRotation ? -70 : -20,
                      position: 'insideBottom',
                      value: xAxisLabel,
                    }
                  : undefined
              }
            />
            <YAxis
              tick={{ fill: '#000', fontSize: '1.25rem' }}
              label={
                yAxisLabel
                  ? {
                      angle: -90,
                      fill: '#000',
                      fontSize: '1.25rem',
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
                  activeDot={{
                    fill: color,
                    r: 8,
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
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
