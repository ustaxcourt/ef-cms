import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from 'recharts';

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
  showLegend?: boolean;
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  /** Optional color for the chart title text */
  titleColor?: string;
  /** Optional color for the datalabels */
  datalabelColor?: string;
  /** Whether to show value labels on bars (default true) */
  showLabels?: boolean;
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
  showLegend?: boolean;
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  stacked?: boolean;
  /** Optional: force x-axis label rotation in degrees (overrides stacked/grouped defaults) */
  xLabelRotation?: number;
  /** Optional: second line to show under each x-axis label (e.g. column totals) */
  columnTotals?: number[];
  /** Whether to show value labels on bars (default true) */
  showLabels?: boolean;
  /** Optional: totals to append to each dataset label in the legend (e.g. [4209, 1608]) */
  legendTotals?: number[];
}

const defaultColors = [
  '#005EA2', // blue primary
  '#FFBE2E', // yellow primary
];

// ─── Custom legend renderer ───────────────────────────────────────────────────

const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="tw:flex tw:flex-wrap tw:gap-3 tw:justify-start tw:pb-5 tw:xs:pb-8">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="tw:flex tw:items-center tw:gap-2">
          <div
            className="tw:shrink-0 tw:border-2 tw:border-black tw:rounded-[0.5rem] tw:w-10 tw:h-10 tw:xs:w-12 tw:xs:h-12"
            style={{ backgroundColor: entry.color }}
          />
          <span className="tw:text-black tw:font-semibold tw:text-base tw:xs:text-xl">
            {entry.total != null
              ? `${entry.value}: ${entry.total.toLocaleString()}`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Shared Y-axis tick ──────────────────────────────────────────────────────

const YAxisTick = (props: any) => {
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

// ─── Shared Y-axis label ─────────────────────────────────────────────────────

const BarYAxisLabel = ({ value, viewBox }: any) => {
  const { x, y, height: h, width: w } = viewBox;
  const cx = x + (w ?? 60) / 2;
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

// ─── SingleBarGraph custom x-axis tick (word-wrapped) ────────────────────────

const SingleBarTickX = (props: any) => {
  const { x, y, payload } = props;
  const words = (payload.value as string).split(' ');
  const lineHeight = 18;
  // wrap into lines of ~10 chars each
  const lines: string[] = [];
  let current = '';
  words.forEach((word: string) => {
    if ((current + ' ' + word).trim().length > 10 && current.length > 0) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  });
  if (current) lines.push(current);

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={0}
          dy={16 + i * lineHeight}
          textAnchor="middle"
          fill="#000"
          className="tw:text-base tw:xs:text-xl"
          fontWeight="600"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

// ─── SingleBarGraph ───────────────────────────────────────────────────────────

export const SingleBarGraph: React.FC<SingleBarGraphProps> = ({
  data,
  title,
  width = 1344,
  showLegend = false,
  showGrid = true,
  xAxisLabel,
  yAxisLabel,
  datalabelColor = '#fff',
  showLabels = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="tw:py-8 tw:text-center tw:text-gray-400">
        {title && (
          <h2
            style={{
              margin: 0,
              padding: '10px 0 8px',
              paddingLeft: '80px',
              textAlign: 'left',
            }}
          >
            {title}
          </h2>
        )}
        <p>No data available</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    label: item.label,
    value: item.value,
  }));

  // Y-axis max rounded up to the nearest multiple of 10
  const rawMax = Math.max(...data.map(d => d.value));
  const yMax = Math.ceil((rawMax * 1.1) / 10) * 10;

  // Extra bottom margin to accommodate multi-line wrapped x-axis labels
  const maxLabelWords = Math.max(...data.map(d => d.label.split(' ').length));
  const estimatedLabelLines = Math.ceil(maxLabelWords / 2);
  const bottomMargin = (xAxisLabel ? 60 : 20) + estimatedLabelLines * 18;

  return (
    <div className="tw:overflow-x-auto">
      <div
        style={
          {
            '--chart-width': `${width / 16}rem`,
            '--chart-width-mobile': '50rem',
          } as React.CSSProperties
        }
        className="tw:w-(--chart-width) tw:max-[479px]:!w-(--chart-width-mobile)"
      >
        {title && (
          <h2 className="tw:xs:text-4xl tw:text-2xl tw:m-0">{title}</h2>
        )}
        <div className="tw:h-[37.5rem] tw:max-[479px]:!h-[28.125rem]">
          <ResponsiveContainer
            width="100%"
            height="100%"
            style={{ outline: 'none' }}
          >
            <BarChart
              data={chartData}
              margin={{ top: 30, right: 30, left: 0, bottom: bottomMargin }}
            >
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
              )}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const item = data.find(d => d.label === label);
                  const color = item?.color || '#005EA2';
                  return (
                    <div
                      role="status"
                      aria-live="polite"
                      className="tw:bg-white tw:py-2 tw:px-3 tw:xs:text-xl tw:text-base tw:flex tw:flex-col tw:border-2 tw:rounded-lg tw:text-black tw:gap-1.5"
                    >
                      <div className="tw:font-bold">{label}</div>
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <span
                          className="tw:inline-block tw:xs:w-5 tw:xs:h-5 tw:w-4 tw:h-4 tw:shrink-0 tw:border tw:xs:rounded-sm tw:rounded-xs"
                          style={{ backgroundColor: color }}
                        />
                        <span>value : {payload[0]?.value}</span>
                      </div>
                    </div>
                  );
                }}
              />
              <XAxis
                dataKey="label"
                tick={<SingleBarTickX />}
                interval={0}
                label={
                  xAxisLabel
                    ? {
                        fill: '#000',
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        offset: -(bottomMargin - 25),
                        position: 'insideBottom',
                        value: xAxisLabel,
                      }
                    : undefined
                }
              />
              <YAxis
                domain={[0, yMax]}
                tick={<YAxisTick />}
                axisLine={true}
                tickLine={false}
                label={
                  yAxisLabel ? <BarYAxisLabel value={yAxisLabel} /> : undefined
                }
              />
              {showLegend && <Legend content={renderCustomLegend} />}
              <Bar
                dataKey="value"
                isAnimationActive={false}
                stroke="#000"
                strokeWidth={2}
              >
                {data.map((item, index) => (
                  <Cell
                    key={index}
                    fill={
                      item.color || defaultColors[index % defaultColors.length]
                    }
                  />
                ))}
                {showLabels && (
                  <LabelList
                    dataKey="value"
                    content={(labelProps: any) => {
                      const {
                        x,
                        y,
                        width: bw,
                        height: bh,
                        value: val,
                      } = labelProps;
                      if (val == null) return null;
                      const cx = x + bw / 2;
                      const labelFitsInside = bh > 36;
                      if (labelFitsInside) {
                        return (
                          <text
                            x={cx}
                            y={y + 28}
                            textAnchor="middle"
                            fill={datalabelColor}
                            fontSize="1.25rem"
                            fontWeight="bold"
                          >
                            {val}
                          </text>
                        );
                      } else {
                        return (
                          <text
                            x={cx}
                            y={y - 6}
                            textAnchor="middle"
                            fill="#000000"
                            fontSize="1.25rem"
                            fontWeight="bold"
                          >
                            {val}
                          </text>
                        );
                      }
                    }}
                  />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ─── MultiBarGraph custom label ───────────────────────────────────────────────

/**
 * Renders a datalabel inside or outside a bar segment depending on its share
 * of the column total. Mirrors the original Chart.js datalabels logic exactly.
 */
const MultiBarLabel = (props: any) => {
  const {
    x,
    y,
    width: barWidth,
    height: barHeight,
    value,
    datasetLabel,
    colTotal,
    stacked,
  } = props;

  if (value == null || colTotal == null || colTotal === 0) return null;

  const threshold = stacked ? 0.15 : 0.1;
  const ratio = value / colTotal;
  const isSmall = ratio < threshold;

  const textColor = isSmall ? '#000000' : '#ffffff';
  const fontSize = '1.25rem';
  const fontWeight = 'bold';

  if (stacked) {
    if (isSmall) {
      // Label above the bar segment
      const cx = x + barWidth / 2;
      const cy = y - 8;
      return (
        <text
          dominantBaseline="auto"
          fill={textColor}
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAnchor="middle"
          x={cx}
          y={cy}
        >
          {value}
        </text>
      );
    } else {
      // Label centered inside the bar: value only
      const cx = x + barWidth / 2;
      const cy = y + barHeight / 2;
      return (
        <text
          dominantBaseline="middle"
          fill={textColor}
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAnchor="middle"
          x={cx}
          y={cy}
        >
          {value}
        </text>
      );
    }
  } else {
    // Grouped: always vertical (-90°), label centered inside bar
    const cx = x + barWidth / 2;
    const cy = y + barHeight / 2;
    const labelText = `${value} ${datasetLabel}`;
    return (
      <text
        dominantBaseline="middle"
        fill={textColor}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAnchor="middle"
        transform={`rotate(-90, ${cx}, ${cy})`}
        x={cx}
        y={cy}
      >
        {labelText}
      </text>
    );
  }
};

// ─── MultiBarGraph ────────────────────────────────────────────────────────────

// ─── MultiBarGraph rotated x-axis tick ───────────────────────────────────────

const RotatedTickX = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={8}
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

// ─── MultiBarGraph two-line x-axis tick ──────────────────────────────────────

const MultiBarTickX = (props: any) => {
  const { x, y, payload, columnTotals } = props;
  const { index } = payload;
  const total = columnTotals?.[index];
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={14}
        textAnchor="middle"
        fill="#000"
        className="tw:text-base tw:xs:text-xl"
        fontWeight="600"
      >
        {payload.value}
      </text>
      {total != null && (
        <text
          x={0}
          y={0}
          dy={34}
          textAnchor="middle"
          fill="#000"
          fontSize="1rem"
        >
          {total}
        </text>
      )}
    </g>
  );
};

export const MultiBarGraph: React.FC<MultiBarGraphProps> = ({
  datasets,
  labels,
  title,
  width = 1344,
  showLegend = true,
  showGrid = true,
  xAxisLabel,
  yAxisLabel,
  stacked = false,
  xLabelRotation,
  columnTotals,
  showLabels = true,
  legendTotals,
}) => {
  // Build recharts row-oriented data: [{ name: 'Jan', Filed: 42, Closed: 3 }, ...]
  const chartData = labels.map((label, i) => {
    const row: Record<string, any> = { name: label };
    datasets.forEach(ds => {
      row[ds.label] = ds.data[i] ?? 0;
    });
    return row;
  });

  // Pre-compute column totals for label positioning
  const colTotals = labels.map((_, i) =>
    datasets.reduce((sum, ds) => sum + ((ds.data[i] as number) || 0), 0),
  );

  // Y-axis max with 10% breathing room
  let maxValue = 0;
  labels.forEach((_, i) => {
    const total = stacked
      ? colTotals[i]
      : Math.max(...datasets.map(ds => (ds.data[i] as number) || 0));
    if (total > maxValue) maxValue = total;
  });
  const yMax = Math.ceil((maxValue * 1.1) / 10) * 10;

  // X-axis tick rotation
  let xAngle: number;
  if (typeof xLabelRotation === 'number') {
    xAngle = xLabelRotation;
  } else {
    xAngle = stacked ? 0 : 45;
  }

  const hasTwoLineTicks = stacked && columnTotals && columnTotals.length > 0;
  // Give rotated 45° labels enough vertical room (longest month name ~110px at 45°)
  const xAxisHeight = hasTwoLineTicks ? 60 : xAngle !== 0 ? 80 : undefined;
  const bottomMargin = xAxisLabel
    ? 60
    : xAngle !== 0
      ? 20
      : hasTwoLineTicks
        ? 20
        : 20;

  // Legend payload for custom renderer
  const legendPayload = datasets.map((ds, i) => ({
    color: ds.color || defaultColors[i % defaultColors.length],
    value: ds.label,
    total: legendTotals?.[i],
  }));

  if (!datasets || datasets.length === 0 || !labels || labels.length === 0) {
    return (
      <div className="tw:py-8 tw:text-center tw:text-gray-400">
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
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="tw:overflow-x-auto">
      <div
        style={
          {
            '--chart-width': `${width / 16}rem`,
            '--chart-width-mobile': '50rem',
          } as React.CSSProperties
        }
        className="tw:w-(--chart-width) tw:max-[479px]:!w-(--chart-width-mobile)"
      >
        {title && (
          <h2 className="tw:xs:pb-8 tw:pb-5 tw:xs:text-4xl tw:text-2xl tw:m-0">
            {title}
          </h2>
        )}
        {showLegend && (
          <div>{renderCustomLegend({ payload: legendPayload })}</div>
        )}
        <div className="tw:h-[37.5rem] tw:max-[479px]:!h-[28.125rem]">
          <ResponsiveContainer
            width="100%"
            height="100%"
            style={{ outline: 'none' }}
          >
            <BarChart
              data={chartData}
              margin={{ bottom: bottomMargin, left: 0, right: 30, top: 30 }}
            >
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
              )}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const labelIndex = labels.indexOf(label as string);
                  const colTotal =
                    stacked && labelIndex >= 0 ? colTotals[labelIndex] : null;
                  return (
                    <div
                      role="status"
                      aria-live="polite"
                      className="tw:bg-white tw:py-2 tw:px-3 tw:xs:text-xl tw:text-base tw:flex tw:flex-col tw:border-2 tw:rounded-lg tw:text-black tw:gap-1.5"
                    >
                      <div className="tw:font-bold">{label}</div>
                      {payload.map((p: any) => (
                        <div
                          key={p.dataKey}
                          className="tw:flex tw:items-center tw:gap-2"
                        >
                          <span
                            className="tw:inline-block tw:xs:w-5 tw:xs:h-5 tw:w-4 tw:h-4 tw:shrink-0 tw:border tw:xs:rounded-sm tw:rounded-xs"
                            style={{ backgroundColor: p.fill || p.color }}
                          />
                          <span>
                            {p.dataKey} : {p.value}
                          </span>
                        </div>
                      ))}
                      {colTotal != null && (
                        <div className="tw:border-t tw:border-gray-300 tw:pt-1 tw:mt-0.5">
                          Total : {colTotal}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              <XAxis
                dataKey="name"
                interval={0}
                tickMargin={8}
                tick={
                  hasTwoLineTicks
                    ? (tickProps: any) => (
                        <MultiBarTickX
                          {...tickProps}
                          columnTotals={columnTotals}
                        />
                      )
                    : xAngle !== 0
                      ? (tickProps: any) => <RotatedTickX {...tickProps} />
                      : { fill: '#000', fontSize: '1.25rem', fontWeight: '600' }
                }
                height={xAxisHeight}
                label={
                  xAxisLabel
                    ? {
                        fill: '#000',
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        offset: -10,
                        position: 'insideBottom',
                        value: xAxisLabel,
                      }
                    : undefined
                }
              />
              <YAxis
                domain={[0, yMax]}
                tick={<YAxisTick />}
                label={
                  yAxisLabel ? <BarYAxisLabel value={yAxisLabel} /> : undefined
                }
              />
              {datasets.map((ds, dsIndex) => {
                const color =
                  ds.color || defaultColors[dsIndex % defaultColors.length];
                return (
                  <Bar
                    key={ds.label}
                    dataKey={ds.label}
                    fill={color}
                    isAnimationActive={false}
                    stackId={stacked ? 'stack' : undefined}
                    stroke="#000"
                    strokeWidth={2}
                  >
                    {showLabels && (
                      <LabelList
                        dataKey={ds.label}
                        content={(labelProps: any) => {
                          const {
                            x,
                            y,
                            width: bw,
                            height: bh,
                            value: val,
                            index,
                          } = labelProps;
                          return (
                            <MultiBarLabel
                              key={`label-${dsIndex}-${index}`}
                              colTotal={colTotals[index]}
                              datasetLabel={ds.label}
                              fill={color}
                              height={bh}
                              stacked={stacked}
                              value={val}
                              width={bw}
                              x={x}
                              y={y}
                            />
                          );
                        }}
                      />
                    )}
                  </Bar>
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
