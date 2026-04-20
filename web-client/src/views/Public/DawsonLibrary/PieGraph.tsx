import React from 'react';

export interface PieGraphData {
  name: string;
  value: number;
  color?: string;
}

import {
  Pie,
  PieChart,
  PieSectorShapeProps,
  Sector,
  Legend,
  Tooltip,
} from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

const PieSector = (props: PieSectorShapeProps) => {
  // recharts spreads each data entry into the shape props, so color is available directly.
  const fill = (props as unknown as PieGraphData).color;
  return (
    <g
      tabIndex={props.index}
      onMouseDown={e => e.preventDefault()}
      onFocus={e => {
        e.currentTarget
          .closest('.recharts-pie-sector')
          ?.dispatchEvent(
            new MouseEvent('mouseover', { bubbles: true, cancelable: true }),
          );
      }}
      onBlur={e => {
        e.currentTarget
          .closest('.recharts-pie-sector')
          ?.dispatchEvent(
            new MouseEvent('mouseout', { bubbles: true, cancelable: true }),
          );
      }}
    >
      <Sector {...props} fill={fill} />
    </g>
  );
};

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
      // className="tw:bg-white tw:rounded tw:py-2 tw:px-3 tw:text-base tw:flex tw:flex-col tw:text-black tw:gap-1.5"
      className="tw:bg-white tw:py-2 tw:px-3 tw:xs:text-xl tw:text-base tw:flex tw:flex-col tw:border-2 tw:rounded-md tw:text-black tw:gap-1.5"
    >
      {title && <div className="tw:font-bold">{title}</div>}
      <div className="tw:flex tw:items-center tw:gap-2">
        <span
          // className="tw:inline-block tw:w-3.5 tw:h-3.5 tw:rounded-sm tw:shrink-0"
          className="tw:inline-block tw:xs:w-5 tw:xs:h-5 tw:w-4 tw:h-4 tw:shrink-0 tw:border tw:xs:rounded-sm tw:rounded-xs"
          style={{ backgroundColor: color }}
        />
        {entry.name}: {value} ({percentage}%)
      </div>
    </div>
  );
};

export const PieGraph = ({
  title,
  data,
  isAnimationActive = true,
  legendFlow = 'column',
}: {
  title: string;
  data: PieGraphData[];
  isAnimationActive?: boolean;
  legendFlow?: 'row' | 'column';
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="tw:py-8 tw:text-center tw:text-gray-400">
        {title && <h2 className="tw:mb-4 tw:text-left tw:text-2xl">{title}</h2>}
        <p>No data available</p>
      </div>
    );
  }

  return (
    // inline-block so multiple graphs sit side-by-side on wide screens;
    // max-w-full constrains to viewport width so overflow-x-auto scrolls when needed.
    <div className="tw:inline-block tw:max-w-full tw:align-top tw:overflow-x-auto">
      <div className="tw:xs:w-160 tw:w-120">
        {title && <h2 className="tw:mb-4 tw:text-left tw:text-2xl">{title}</h2>}
        <PieChart
          style={{
            width: '100%',
            maxWidth: '100%',
            aspectRatio: 1,
          }}
          tabIndex={-1}
        >
          <Legend
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: 0 }}
            content={() => (
              <ul
                className={`tw:grid tw:list-none tw:p-0 tw:m-0 tw:gap-4 ${legendFlow === 'column' ? 'tw:grid-rows-2 tw:grid-flow-col' : 'tw:grid-cols-3 tw:grid-flow-row'}`}
              >
                {data.map(entry => (
                  <li key={entry.name} className="tw:flex tw:items-center">
                    <span
                      className="tw:inline-block tw:xs:w-12 tw:xs:h-12 tw:w-10 tw:h-10 tw:mr-1.5 tw:border-2 tw:border-black tw:rounded-md tw:shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="tw:text-black tw:font-semibold tw:xs:text-xl tw:text-base tw:w-32 tw:leading-[1.1]">
                      {entry.name}
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
            dataKey="value"
            nameKey="label"
            isAnimationActive={isAnimationActive}
            shape={PieSector}
            startAngle={90}
            endAngle={450}
            strokeWidth={2}
            stroke="#000"
            // className="tw:focus-visible:ring-offset-4 tw:focus-visible:ring-ring tw:focus-visible:outline-none"
          />
          <RechartsDevtools />
        </PieChart>
      </div>
    </div>
  );
};
