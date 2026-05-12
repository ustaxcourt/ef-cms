import React, { useRef, useEffect } from 'react';
import { Button } from '@web-client/dawson-ui/ui/button';
import {
  Pie,
  PieChart,
  PieSectorShapeProps,
  Sector,
  Legend,
  Tooltip,
} from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

export interface PieGraphData {
  name: string;
  value: number;
  color?: string;
}

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
  onAnnounce,
}: {
  active?: boolean;
  payload?: { value: number; payload: PieGraphData }[];
  data: PieGraphData[];
  title: string;
  onAnnounce: (text: string) => void;
}) => {
  useEffect(() => {
    if (active && payload?.length) {
      const entry = payload[0].payload;
      const { value } = payload[0];
      const total = data.reduce((sum, d) => sum + d.value, 0);
      const percentage = ((value / total) * 100).toFixed(1);

      const announcement = `${title ? title + ': ' : ''}${entry.name}: ${value} (${percentage}%)`;
      onAnnounce(announcement);
    }
  }, [active, payload, data, title, onAnnounce]);

  if (!active || !payload?.length) return null;

  const entry = payload[0].payload;
  const { value } = payload[0];
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const percentage = ((value / total) * 100).toFixed(1);
  const { color } = entry;

  return (
    <div
      aria-hidden="true"
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
}: {
  title: string;
  data: PieGraphData[];
  isAnimationActive?: boolean;
}) => {
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const announce = (text: string) => {
    if (liveRegionRef.current) liveRegionRef.current.textContent = text;
  };

  const openHtmlTable = () => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const rows = data
      .map(d => {
        const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0.0';
        return `<tr><td>${d.name}</td><td>${d.value}</td><td>${pct}%</td></tr>`;
      })
      .join('');
    const html = `<html><body><h2>${title}</h2><table border="1" cellpadding="4" cellspacing="0"><thead><tr><th>Name</th><th>Value</th><th>Percentage</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    window.open(URL.createObjectURL(blob), '_blank');
  };

  if (!data || data.length === 0) {
    return (
      <div className="tw:py-8 tw:text-center tw:text-gray-400">
        {title && (
          <h2 className="tw:xs:mb-8 tw:mb-5 tw:text-left tw:xs:text-2xl tw:text-lg">
            {title}
          </h2>
        )}
        <p>No data available</p>
      </div>
    );
  }

  return (
    // inline-block so multiple graphs sit side-by-side on wide screens;
    // max-w-full constrains to viewport width so overflow-x-auto scrolls when needed.
    <div className="tw:inline-block tw:max-w-full tw:align-top tw:overflow-x-auto tw:pt-2">
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="tw:sr-only"
      />
      <div className="tw:xs:w-160 tw:w-120">
        {title && (
          <div
            className="tw:flex tw:flex-nowrap tw:items-center tw:justify-between tw:gap-4"
            style={{ marginBottom: '1.25rem' }}
          >
            <h2
              className="tw:xs:text-2xl tw:text-lg tw:whitespace-nowrap"
              style={{ margin: 0 }}
            >
              {title}
            </h2>
            <Button
              className="tw:w-auto tw:!mr-5"
              variant="primaryTertiary"
              onClick={openHtmlTable}
            >
              HTML view
            </Button>
          </div>
        )}
        <PieChart
          style={{ width: '100%', maxWidth: '100%', aspectRatio: 1 }}
          tabIndex={-1}
          responsive
        >
          <Legend
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: 0 }}
            content={() => (
              <ul className="tw:grid tw:list-none tw:p-0 tw:m-0 tw:gap-x-4 tw:gap-y-3 tw:xs:gap-y-4 tw:grid-rows-2 tw:grid-flow-col">
                {data.map(entry => (
                  <li key={entry.name} className="tw:flex tw:items-center">
                    <span
                      className="tw:inline-block tw:xs:w-12 tw:xs:h-12 tw:w-10 tw:h-10 tw:mr-1.5 tw:border-2 tw:border-black tw:rounded-md tw:shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="tw:text-black tw:font-semibold tw:xs:text-xl tw:text-base tw:leading-[1.1] tw:w-24 tw:xs:w-32">
                      {entry.name}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          />
          <Tooltip
            content={
              <CustomTooltip data={data} title={title} onAnnounce={announce} />
            }
          />
          <Pie
            data={data}
            labelLine={false}
            dataKey="value"
            nameKey="name"
            isAnimationActive={isAnimationActive}
            shape={PieSector}
            startAngle={90}
            endAngle={450}
            strokeWidth={2}
            stroke="#000"
          />
          {process.env.NODE_ENV !== 'production' && <RechartsDevtools />}
        </PieChart>
      </div>
    </div>
  );
};
