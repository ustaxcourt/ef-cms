import React from 'react';
import { Button } from '@web-client/dawson-ui/ui/button';
import {
  BarYAxisLabel,
  MultiBarLabel,
  MultiBarTickX,
  RotatedTickX,
  SingleBarTickX,
  YAxisTick,
  renderCustomLegend,
} from './BarGraphHelpers';
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
  const openHtmlTable = () => {
    const rows = data
      .map(d => `<tr><td>${d.label}</td><td>${d.value}</td></tr>`)
      .join('');
    const heading = title ? `<h2>${title}</h2>` : '';
    const html = `<html><body>${heading}<table border="1" cellpadding="4" cellspacing="0"><thead><tr><th>Label</th><th>Value</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
  };
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
    <div className="tw:overflow-x-auto tw:pb-1 tw:pl-1">
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
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <h2 className="tw:xs:text-2xl tw:text-lg" style={{ margin: 0 }}>
              {title}
            </h2>
            <Button variant="primaryTertiary" onClick={openHtmlTable}>
              HTML view
            </Button>
          </div>
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
                tickLine={true}
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
  const openHtmlTable = () => {
    const headerCells = [
      '<th>Label</th>',
      ...datasets.map(ds => `<th>${ds.label}</th>`),
    ].join('');
    const rows = labels
      .map((label, i) => {
        const cells = datasets
          .map(ds => `<td>${ds.data[i] ?? ''}</td>`)
          .join('');
        return `<tr><td>${label}</td>${cells}</tr>`;
      })
      .join('');
    const heading = title ? `<h2>${title}</h2>` : '';
    const html = `<html><body>${heading}<table border="1" cellpadding="4" cellspacing="0"><thead><tr>${headerCells}</tr></thead><tbody>${rows}</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
  };
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
    <div className="tw:overflow-x-auto tw:pb-1 tw:pl-1">
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
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <h2 className="tw:xs:text-2xl tw:text-lg" style={{ margin: 0 }}>
              {title}
            </h2>
            <Button variant="primaryTertiary" onClick={openHtmlTable}>
              HTML view
            </Button>
          </div>
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
