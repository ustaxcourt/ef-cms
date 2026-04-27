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

const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="tw:flex tw:flex-wrap tw:gap-3 tw:xs:gap-4 tw:justify-start tw:mb-5 tw:xs:mb-8">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="tw:flex tw:items-center tw:gap-2">
          <div
            className="tw:shrink-0 tw:border-2 tw:border-black tw:rounded-[0.5rem] tw:w-10 tw:h-10 tw:xs:w-12 tw:xs:h-12"
            style={{ backgroundColor: entry.color }}
          />
          <span className="tw:text-black tw:font-semibold tw:text-base tw:xs:text-xl">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

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
        className="tw:text-base tw:xs:text-xl"
        fontWeight="600"
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
        className="tw:text-base tw:xs:text-xl"
        fontWeight="600"
      >
        {payload.value}
      </text>
    </g>
  );
};

const LineYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill="#000"
        className="tw:text-base tw:xs:text-xl"
        fontWeight="400"
      >
        {payload.value}
      </text>
    </g>
  );
};

const LineYAxisLabel = ({ value, viewBox }: any) => {
  const { x, y, height: h, width: w } = viewBox;
  const cx = x + (w ?? 80) / 2 - 20;
  const cy = y + h / 2;
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      fill="#000"
      className="tw:text-base tw:xs:text-xl"
      fontWeight="bold"
      transform={`rotate(-90, ${cx}, ${cy})`}
    >
      {value}
    </text>
  );
};

const TooltipContent = ({
  active,
  datasets,
  label,
  mergedData,
}: {
  active?: boolean;
  datasets: LineGraphDataset[];
  label?: string | number;
  mergedData: Record<string, any>[];
}) => {
  if (!active || !label) return null;
  const row = mergedData.find(d => d.name === label);
  if (!row) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="tw:bg-white tw:py-2 tw:px-3 tw:flex tw:flex-col tw:border-2 tw:rounded-lg tw:text-black tw:gap-1.5"
    >
      <div className="tw:font-bold tw:text-base tw:xs:text-xl">{label}</div>
      {datasets.map((ds, i) => {
        const color = ds.color || defaultColors[i % defaultColors.length];
        return (
          <div key={ds.label} className="tw:flex tw:items-center tw:gap-2">
            <span
              className="tw:inline-block tw:xs:w-5 tw:xs:h-5 tw:w-4 tw:h-4 tw:shrink-0 tw:border tw:xs:rounded-sm tw:rounded-xs"
              style={{ backgroundColor: color }}
            />
            <span className="tw:text-base tw:xs:text-xl">
              {ds.label} : {row[`${ds.label}_tip`]}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const LineGraph: React.FC<LineGraphProps> = ({
  datasets,
  labels,
  title,
  width = 1344,
  showLegend = true,
  showGrid = true,
  xAxisLabel,
  xLabelRotation,
  yAxisLabel,
  smooth = false,
}) => {
  if (!datasets || datasets.length === 0 || !labels || labels.length === 0) {
    return (
      <div className="tw:py-8 tw:text-center tw:text-gray-400">
        {title && (
          <h2 className="tw:mb-4 tw:text-left tw:xs:text-2xl tw:text-lg">
            {title}
          </h2>
        )}
        <p>No data available</p>
      </div>
    );
  }

  const chartData = labels.map((label, i) => {
    const row: Record<string, any> = { name: label };
    datasets.forEach(ds => {
      row[ds.label] = ds.data[i] ?? 0;
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
    <div className="tw:overflow-x-auto tw:pb-1 tw:pl-1">
      <div
        // Must use style for width to work with recharts' ResponsiveContainer and maintain aspect ratio
        style={
          {
            '--chart-width': `${width / 16}rem`,
            '--chart-width-mobile': '50rem',
          } as React.CSSProperties
        }
        className="tw:w-(--chart-width) tw:max-[479px]:!w-(--chart-width-mobile)"
      >
        {title && (
          <h2 className="tw:mb-5 tw:xs:mb-8 tw:text-left tw:xs:text-2xl tw:text-lg">
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
        <div className="tw:h-[37.5rem] tw:max-[479px]:!h-[28.125rem]">
          <ResponsiveContainer
            width="100%"
            height="100%"
            style={{ outline: 'none' }}
          >
            <LineChart
              data={mergedData}
              margin={{
                bottom: xAxisLabel ? 40 : 10,
                left: 0,
                right: 30,
                top: 10,
              }}
            >
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <Tooltip
                cursor={{ stroke: '#ccc', strokeWidth: 1 }}
                content={({ active, label }) => (
                  <TooltipContent
                    active={active}
                    datasets={datasets}
                    label={label}
                    mergedData={mergedData}
                  />
                )}
              />
              <XAxis
                dataKey="name"
                interval={0}
                height={xLabelRotation ? 70 : 55}
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
                        fontWeight: 'bold',
                        offset: xLabelRotation ? -70 : -10,
                        position: 'insideBottom',
                        value: xAxisLabel,
                      }
                    : undefined
                }
              />
              <YAxis
                width={80}
                tick={<LineYAxisTick />}
                label={
                  yAxisLabel ? <LineYAxisLabel value={yAxisLabel} /> : undefined
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
                    dot={(dotProps: any) => (
                      <Dot
                        key={dotProps.key}
                        {...dotProps}
                        r={5}
                        fill={color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    )}
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
    </div>
  );
};
