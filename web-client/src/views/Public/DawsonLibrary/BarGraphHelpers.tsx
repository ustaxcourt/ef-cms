import React from 'react';

// ─── Custom legend renderer ───────────────────────────────────────────────────

export const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="tw:flex tw:flex-wrap tw:gap-3 tw:xs:gap-4 tw:justify-start tw:pb-5 tw:xs:pb-8">
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

export const YAxisTick = (props: any) => {
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

export const BarYAxisLabel = ({ value, viewBox }: any) => {
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

export const SingleBarTickX = (props: any) => {
  const { x, y, payload } = props;
  const words = (payload.value as string).split(' ');
  const lineHeight = 18;
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

// ─── MultiBarGraph custom label ───────────────────────────────────────────────

/**
 * Renders a datalabel inside or outside a bar segment depending on its share
 * of the column total. Mirrors the original Chart.js datalabels logic exactly.
 */
export const MultiBarLabel = (props: any) => {
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

// ─── MultiBarGraph rotated x-axis tick ───────────────────────────────────────

export const RotatedTickX = (props: any) => {
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

export const MultiBarTickX = (props: any) => {
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
