import { BigHeader } from '@web-client/views/BigHeader';
import React from 'react';
import { Buttons } from '@web-client/views/Public/DawsonLibrary/Buttons';
import { Alerts } from '@web-client/views/Public/DawsonLibrary/Alerts';
import { Tags } from '@web-client/views/Public/DawsonLibrary/Tags';
import { Inputs } from '@web-client/views/Public/DawsonLibrary/Inputs';
import { PieGraph } from './PieGraph';
import { LineGraph } from './LineGraph';
import { SingleBarGraph, MultiBarGraph } from './BarGraph';

const DEFAULT_CHART_WIDTH = 1344;
const DEFAULT_CHART_HEIGHT = 800;

export const DawsonLibrary = () => {
  return (
    <>
      <BigHeader text="Dawson Library" />
      <SingleBarGraph
        title="Cases by Type"
        width={DEFAULT_CHART_WIDTH}
        height={DEFAULT_CHART_HEIGHT}
        titleColor="#000"
        datalabelColor="#fff"
        xAxisLabel="Case Type"
        yAxisLabel="Number of Cases"
        data={[
          { label: 'Deficiency', value: 312, color: '#005EA2' },
          { label: 'Lien/Levy', value: 178, color: '#005EA2' },
          { label: 'Whistleblower', value: 94, color: '#005EA2' },
          { label: 'Passport', value: 57, color: '#005EA2' },
          { label: 'Other', value: 130, color: '#005EA2' },
        ]}
      />
      <MultiBarGraph
        width={DEFAULT_CHART_WIDTH}
        height={DEFAULT_CHART_HEIGHT}
        title="Filed vs Closed Cases by Month (Stacked)"
        xAxisLabel="Month"
        yAxisLabel="Number of Cases"
        stacked
        labels={[
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]}
        datasets={[
          {
            label: 'Filed',
            data: [42, 55, 38, 61, 74, 58, 65, 70, 53, 48, 60, 72],
          },
          {
            label: 'Closed',
            data: [3, 4, 4, 6, 6, 5, 5, 6, 5, 4, 5, 8],
          },
        ]}
      />
      <MultiBarGraph
        width={DEFAULT_CHART_WIDTH}
        height={DEFAULT_CHART_HEIGHT}
        title="Filed vs Closed Cases by Month (Grouped)"
        xAxisLabel="Month"
        yAxisLabel="Number of Cases"
        labels={[
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]}
        datasets={[
          {
            label: 'Filed',
            data: [42, 55, 38, 61, 74, 58, 65, 70, 53, 48, 60, 72],
          },
          {
            label: 'Closed',
            data: [3, 4, 4, 6, 6, 5, 5, 6, 5, 4, 5, 6],
          },
        ]}
      />
      {/* Grouped bar - normal (0°) month labels */}
      <MultiBarGraph
        width={DEFAULT_CHART_WIDTH}
        height={DEFAULT_CHART_HEIGHT}
        title="Grouped - Labels Normal"
        xAxisLabel="Month"
        yAxisLabel="Number of Cases"
        xLabelRotation={0}
        labels={[
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]}
        datasets={[
          {
            label: 'Filed',
            data: [42, 55, 38, 61, 74, 58, 65, 70, 53, 48, 60, 72],
          },
          {
            label: 'Closed',
            data: [3, 4, 4, 6, 6, 5, 5, 6, 5, 4, 5, 6],
          },
        ]}
      />

      {/* Grouped bar - labels rotated 90° */}
      <MultiBarGraph
        width={DEFAULT_CHART_WIDTH}
        height={DEFAULT_CHART_HEIGHT}
        title="Grouped - Labels 90°"
        xAxisLabel="Month"
        yAxisLabel="Number of Cases"
        xLabelRotation={90}
        labels={[
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]}
        datasets={[
          {
            label: 'Filed',
            data: [42, 55, 38, 61, 74, 58, 65, 70, 53, 48, 60, 72],
          },
          {
            label: 'Closed',
            data: [3, 4, 4, 6, 6, 5, 5, 6, 5, 4, 5, 6],
          },
        ]}
      />
      <LineGraph
        width={DEFAULT_CHART_WIDTH}
        height={DEFAULT_CHART_HEIGHT}
        title="Cases Filed Over Time"
        xAxisLabel="Month"
        yAxisLabel="Number of Cases"
        labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
        datasets={[
          {
            label: 'Regular Cases',
            data: [55, 38, -100, 65, 75, -70, 20],
          },
          {
            label: 'Small Tax Cases',
            data: [-70, -10, -38, 78, -38, -33, -31],
          },
        ]}
        smooth
      />
      <LineGraph
        width={DEFAULT_CHART_WIDTH}
        height={DEFAULT_CHART_HEIGHT}
        title="Case Type Breakdown by Quarter"
        xAxisLabel="Quarter"
        yAxisLabel="Number of Cases"
        labels={['Q1', 'Q2', 'Q3', 'Q4']}
        datasets={[
          {
            label: 'Deficiency',
            data: [120, 145, 132, 160],
          },
          {
            label: 'Lien/Levy',
            data: [85, 92, 78, 101],
          },
          {
            label: 'Whistleblower',
            data: [34, 41, 29, 38],
          },
          {
            label: 'Passport',
            data: [18, 22, 25, 19],
          },
          {
            label: 'Other',
            data: [55, 48, 63, 57],
          },
        ]}
      />
      <PieGraph
        rotation={25}
        data={[
          { label: 'Type A', value: 92.5 },
          { label: 'Type B', value: 7.5 },
        ]}
        title="Sample Distribution 1"
      />
      {/* Pie with no outline */}
      <PieGraph
        rotation={0}
        outline="none"
        data={[
          { label: 'NoOutline A', value: 60 },
          { label: 'NoOutline B', value: 40 },
        ]}
        title="Pie — No Outline"
      />
      {/* Pie with white outline */}
      <PieGraph
        rotation={0}
        outline="white"
        data={[
          { label: 'WhiteOutline A', value: 30 },
          { label: 'WhiteOutline B', value: 70 },
        ]}
        title="Pie — White Outline"
      />
      <PieGraph
        data={[
          { label: 'Type A', value: 25 },
          { label: 'Type B', value: 15 },
          { label: 'Type C', value: 10 },
          { label: 'Type D', value: 20 },
          { label: 'Type E', value: 35 },
          { label: 'Type F', value: 5 },
        ]}
        title="Sample Distribution 2"
        rotation={60}
      />
      <PieGraph
        rotation={90}
        data={[
          { label: 'Type A', value: 75 },
          { label: 'Type B', value: 15 },
          { label: 'Type C', value: 15 },
          { label: 'Type D', value: 2 },
          { label: 'Type E', value: 2 },
          { label: 'Type F', value: 2 },
        ]}
        title="Session Distribution 1"
        type="session"
      />

      <div className="card margin-2 padding-2">
        <Buttons />
        <Alerts />
        <Tags />
        <Inputs />
      </div>
    </>
  );
};
