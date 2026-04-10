import React from 'react';

export interface PieGraphData {
  label: string;
  value: number;
  color?: string;
  labelColor?: string;
}

// interface PieGraphProps {
//   data: PieGraphData[];
//   title?: string;
//   width?: number;
//   height?: number;
//   showLegend?: boolean;
//   showLabels?: boolean;
//   /**
//    * Outline option for pie slices. 'none' -> no border; 'white' -> white border; 'black' -> black border (default)
//    */
//   outline?: 'none' | 'white' | 'black';
// }

import {
  Pie,
  PieChart,
  PieSectorShapeProps,
  Sector,
  Legend,
  Tooltip,
} from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

const CustomTooltip = ({
  active,
  payload,
  data,
  title,
}: {
  active?: boolean;
  payload?: { value: number; payload: PieGraphData }[];
  data: PieGraphData[];
  title: string;
}) => {
  if (!active || !payload?.length) return null;

  const entry = payload[0].payload;
  const { value } = payload[0];
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const percentage = ((value / total) * 100).toFixed(1);
  const { color } = entry;

  return (
    <div
      role="status"
      aria-live="polite"
      className="tw:bg-[#1B1B1B] tw:rounded tw:py-2 tw:px-3 tw:text-base tw:flex tw:flex-col tw:text-white tw:gap-1.5"
    >
      {title && <div className="tw:font-bold">{title}</div>}
      <div className="tw:flex tw:items-center tw:gap-2">
        <span
          className="tw:inline-block tw:w-3.5 tw:h-3.5 tw:rounded-sm tw:shrink-0"
          style={{ backgroundColor: color }}
        />
        {entry.label}: {value} ({percentage}%)
      </div>
    </div>
  );
};

export const PieGraph = ({
  title,
  data,
  isAnimationActive = true,
}: {
  title: string;
  data: PieGraphData[];
  isAnimationActive?: boolean;
}) => {
  // Custom shape component for the pie slices.
  const MyCustomPie = (props: PieSectorShapeProps) => {
    const entry = data[props.index] as PieGraphData | undefined;
    const fill = entry?.color;
    return <Sector {...props} fill={fill} stroke="#000" strokeWidth={2} />;
  };
  return (
    <div className="tw:inline-block">
      {title && <h2 className="tw:mb-4 tw:text-left tw:text-2xl">{title}</h2>}
      <PieChart
        style={{
          width: '39rem',
          maxHeight: '80vh',
          aspectRatio: 1,
        }}
        responsive
      >
        <Legend
          verticalAlign="top"
          wrapperStyle={{ paddingBottom: 0 }}
          content={() => (
            <ul className="tw:grid tw:grid-rows-2 tw:grid-flow-col tw:list-none tw:p-0 tw:m-0 tw:gap-4">
              {data.map(entry => (
                <li key={entry.label} className="tw:flex tw:items-center">
                  <span
                    className="tw:inline-block tw:w-12 tw:h-12 tw:mr-1.5 tw:border-2 tw:border-black tw:rounded-lg tw:shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="tw:text-black tw:font-bold tw:text-xl tw:w-32">
                    {entry.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        />
        <Tooltip content={<CustomTooltip data={data} title={title} />} />
        <Pie
          data={data}
          labelLine={false}
          fill="#8884d8" // default fill color (overridden by MyCustomPie)
          dataKey="value"
          nameKey="label"
          isAnimationActive={isAnimationActive}
          shape={MyCustomPie}
          startAngle={90}
          endAngle={450}
        />
        <RechartsDevtools />
      </PieChart>
    </div>
  );
};
