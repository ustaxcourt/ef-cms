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
  height?: number;
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
  height?: number;
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
            {entry.total != null
              ? `${entry.value}: ${entry.total.toLocaleString()}`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
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
          fontSize={16}
          fontWeight="bold"
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
  height = 800,
  showLegend = false,
  showGrid = true,
  xAxisLabel,
  yAxisLabel,
  titleColor = '#000',
  datalabelColor = '#fff',
  showLabels = true,
}) => {
  const chartData = data.map(item => ({
    label: item.label,
    value: item.value,
  }));

  // Extra bottom margin to accommodate multi-line wrapped x-axis labels
  const maxLabelWords = Math.max(...data.map(d => d.label.split(' ').length));
  const estimatedLabelLines = Math.ceil(maxLabelWords / 2);
  const bottomMargin = (xAxisLabel ? 60 : 20) + estimatedLabelLines * 18;

  return (
    <div className="tw:overflow-x-auto tw:overflow-y-hidden tw:pb-[60px] tw:scrollbar-hide">
      <div style={{ width: `${width}px`, height: `${height}px` }}>
        {title && (
          <h2
            style={{
              color: titleColor,
              margin: 0,
              padding: '10px 0 8px',
              paddingLeft: '80px',
              textAlign: 'left',
            }}
          >
            {title}
          </h2>
        )}
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ outline: 'none' }}
        >
          <BarChart
            data={chartData}
            margin={{ top: 30, right: 30, left: 20, bottom: bottomMargin }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
            )}
            <Tooltip cursor={false} />
            <XAxis
              dataKey="label"
              tick={<SingleBarTickX />}
              interval={0}
              label={
                xAxisLabel
                  ? {
                      fill: '#000',
                      fontSize: 20,
                      fontWeight: 'bold',
                      offset: -(bottomMargin - 25),
                      position: 'insideBottom',
                      value: xAxisLabel,
                    }
                  : undefined
              }
            />
            <YAxis
              tick={{ fontSize: 20, fill: '#000', fontWeight: 'bold' }}
              axisLine={true}
              tickLine={false}
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
            {showLegend && <Legend content={renderCustomLegend} />}
            <Bar
              dataKey="value"
              isAnimationActive={false}
              stroke="none"
              activeBar={false}
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
                          fontSize={20}
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
                          fontSize={20}
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
  const fontSize = 20;
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
        dy={26}
        textAnchor="middle"
        fill="#000"
        fontSize={18}
        fontWeight="bold"
      >
        {payload.value}
      </text>
      {total != null && (
        <text x={0} y={0} dy={46} textAnchor="middle" fill="#000" fontSize={16}>
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
  height = 800,
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
  const yMax = Math.ceil(maxValue * 1.1);

  // X-axis tick rotation
  let xAngle: number;
  if (typeof xLabelRotation === 'number') {
    xAngle = xLabelRotation;
  } else {
    xAngle = stacked ? 0 : 45;
  }

  const hasTwoLineTicks = stacked && columnTotals && columnTotals.length > 0;
  // Give rotated 45° labels enough vertical room (longest month name ~110px at 45°)
  const xAxisHeight = hasTwoLineTicks ? 80 : xAngle !== 0 ? 120 : undefined;
  const bottomMargin = xAxisLabel
    ? 60
    : xAngle !== 0
      ? 40
      : hasTwoLineTicks
        ? 30
        : 20;

  // Legend payload for custom renderer
  const legendPayload = datasets.map((ds, i) => ({
    color: ds.color || defaultColors[i % defaultColors.length],
    value: ds.label,
    total: legendTotals?.[i],
  }));

  return (
    <div className="tw:overflow-x-auto tw:overflow-y-hidden tw:pb-[60px] tw:scrollbar-hide">
      <div style={{ width: `${width}px`, height: `${height}px` }}>
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
            {renderCustomLegend({ payload: legendPayload })}
          </div>
        )}
        <ResponsiveContainer
          width="100%"
          height="100%"
          style={{ outline: 'none' }}
        >
          <BarChart
            data={chartData}
            margin={{ bottom: bottomMargin, left: 20, right: 30, top: 30 }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
            )}
            <Tooltip cursor={false} />
            <XAxis
              dataKey="name"
              interval={0}
              tickLine={false}
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
                    : { fill: '#000', fontSize: 20 }
              }
              height={xAxisHeight}
              label={
                xAxisLabel
                  ? {
                      fill: '#000',
                      fontSize: 20,
                      fontWeight: 'bold',
                      offset: -10,
                      position: 'insideBottom',
                      value: xAxisLabel,
                    }
                  : undefined
              }
            />
            <YAxis
              domain={[0, yMax]}
              tick={{ fill: '#000', fontSize: 20, fontWeight: 'bold' }}
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
                  strokeWidth={1}
                  activeBar={false}
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
  );
};
