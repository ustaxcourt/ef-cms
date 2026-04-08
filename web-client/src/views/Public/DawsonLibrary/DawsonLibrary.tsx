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
        title="Created Special Sessions by Location"
        width={DEFAULT_CHART_WIDTH}
        height={DEFAULT_CHART_HEIGHT}
        showLabels={false}
        data={[
          { label: 'Atlanta, GA', value: 9, color: '#005EA2' },
          { label: 'Des Moines, IA', value: 9, color: '#005EA2' },
          { label: 'Indianapolis, IN', value: 9, color: '#005EA2' },
          { label: 'Birmingham, AL', value: 7, color: '#005EA2' },
          { label: 'Denver, CO', value: 5, color: '#005EA2' },
          { label: 'Louisville, KY', value: 5, color: '#005EA2' },
        ]}
      />
      <div style={{ marginTop: '48px' }} />
      <MultiBarGraph
        width={DEFAULT_CHART_WIDTH}
        height={DEFAULT_CHART_HEIGHT}
        title="Total Petitions by Month"
        yAxisLabel="Total"
        stacked
        showLabels={false}
        legendTotals={[4209, 1608]}
        xLabelRotation={45}
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
            label: 'Electronic',
            data: [1175, 810, 1175, 875, 125, 0, 0, 0, 0, 0, 0, 0],
            color: '#005EA2',
          },
          {
            label: 'Paper',
            data: [50, 45, 230, 125, 50, 0, 0, 0, 0, 0, 0, 0],
            color: '#FFBE2E',
          },
        ]}
      />
      <div style={{ marginTop: '48px' }} />
      <MultiBarGraph
        width={DEFAULT_CHART_WIDTH}
        height={DEFAULT_CHART_HEIGHT}
        title="Closed/Closed - Dismissed &amp; Changed to On Appeal"
        yAxisLabel="Total"
        showLabels={false}
        legendTotals={[4069, 19]}
        xLabelRotation={45}
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
            label: 'Closed/Closed-Dismissed',
            data: [130, 113, 130, 113, 13, 0, 0, 0, 0, 0, 0, 0],
            color: '#005EA2',
          },
          {
            label: 'Changed to On Appeal',
            data: [8, 8, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0],
            color: '#FFBE2E',
          },
        ]}
      />{' '}
      <div style={{ marginTop: '100px' }} />
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
      <div style={{ marginTop: '100px' }} />
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
