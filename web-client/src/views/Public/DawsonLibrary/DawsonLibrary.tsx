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
      <div>
        <h1>PieGraph</h1>
        <PieGraph
          title="Procedure Type"
          data={[
            { label: 'In Person', value: 75, color: '#005EA2' },
            {
              label: 'Remote',
              value: 25,
              color: '#FFBE2E',
            },
          ]}
        />
        <PieGraph
          title="Session Type"
          data={[
            { label: 'Regular', value: 40, color: '#B4D0B9' },
            { label: 'Hybrid-S', value: 8, color: '#F2938C' },
            { label: 'Hybrid', value: 8, color: '#FEE685' },
            { label: 'Motion/ Hearing', value: 2.5, color: '#D0C3E9' },
            { label: 'Small', value: 2.5, color: '#97D4EA' },
            { label: 'Special', value: 2.5, color: '#E5A000' },
          ]}
        />
      </div>
      <div className="card margin-2 padding-2">
        <Buttons />
        <Alerts />
        <Tags />
        <Inputs />
        <div>
          <div className="tw:mt-12">
            <h1 className="tw:xs:text-4xl tw:text-2xl tw:m-0">Heading 1</h1>
            <h1 className="tw:xs:text-4xl tw:text-2xl tw:m-0">Heading 1</h1>
            <h1 className="tw:xs:text-4xl tw:text-2xl tw:m-0">Heading 1</h1>
            <h1 className="tw:xs:text-4xl tw:text-2xl tw:m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              nam repellat aliquam dolore expedita obcaecati
            </h1>
          </div>
          <div className="tw:mt-12">
            <h2 className="tw:xs:text-2xl tw:text-lg tw:m-0">Heading 2</h2>
            <h2 className="tw:xs:text-2xl tw:text-lg tw:m-0">Heading 2</h2>
            <h2 className="tw:xs:text-2xl tw:text-lg tw:m-0">Heading 2</h2>
            <h2 className="tw:xs:text-2xl tw:text-lg tw:m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              nam repellat aliquam dolore expedita obcaecati
            </h2>
          </div>
          <div className="tw:mt-12">
            <h3 className="tw:xs:text-xl tw:text-base tw:m-0">Heading 3</h3>
            <h3 className="tw:xs:text-xl tw:text-base tw:m-0">Heading 3</h3>
            <h3 className="tw:xs:text-xl tw:text-base tw:m-0">Heading 3</h3>
            <h3 className="tw:xs:text-xl tw:text-base tw:m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              nam repellat aliquam dolore expedita obcaecati
            </h3>
          </div>
          <div className="tw:mt-12">
            <p className="tw:xs:text-lg tw:text-base tw:m-0">Body</p>
            <p className="tw:xs:text-lg tw:text-base tw:m-0">Body</p>
            <p className="tw:xs:text-lg tw:text-base tw:m-0">Body</p>
            <p className="tw:xs:text-lg tw:text-base tw:m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              nam repellat aliquam dolore expedita obcaecati
            </p>
          </div>
          <div className="tw:mt-12">
            <p className="tw:xs:text-base tw:text-sm tw:m-0">Body Secondary</p>
            <p className="tw:xs:text-base tw:text-sm tw:m-0">Body Secondary</p>
            <p className="tw:xs:text-base tw:text-sm tw:m-0">Body Secondary</p>
            <p className="tw:xs:text-base tw:text-sm tw:m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              nam repellat aliquam dolore expedita obcaecati
            </p>
          </div>
          <div className="tw:mt-12">
            <p className="tw:xs:text-lg tw:text-base tw:m-0">Field Label</p>
            <p className="tw:xs:text-lg tw:text-base tw:m-0">Field Label</p>
            <p className="tw:xs:text-lg tw:text-base tw:m-0">Field Label</p>
            <p className="tw:xs:text-lg tw:text-base tw:m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              nam repellat aliquam dolore expedita obcaecati
            </p>
          </div>
          <div className="tw:mt-12">
            <p className="tw:xs:text-lg tw:font-bold tw:text-bold tw:m-0">
              Field Label Bold
            </p>
            <p className="tw:xs:text-lg tw:font-bold tw:text-bold tw:m-0">
              Field Label Bold
            </p>
            <p className="tw:xs:text-lg tw:font-bold tw:text-bold tw:m-0">
              Field Label Bold
            </p>
            <p className="tw:xs:text-lg tw:font-bold tw:text-bold tw:m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              nam repellat aliquam dolore expedita obcaecati
            </p>
          </div>
          <div className="tw:mt-12">
            <p className="tw:xs:text-sm tw:font-bold tw:text-xs tw:m-0">
              Field Label Bold Small
            </p>
            <p className="tw:xs:text-sm tw:font-bold tw:text-xs tw:m-0">
              Field Label Bold Small
            </p>
            <p className="tw:xs:text-sm tw:font-bold tw:text-xs tw:m-0">
              Field Label Bold Small
            </p>
            <p className="tw:xs:text-sm tw:font-bold tw:text-xs tw:m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              nam repellat aliquam dolore expedita obcaecati
            </p>
          </div>
          <div className="tw:mt-12">
            <p className="tw:xs:text-xs tw:text-xs tw:m-0">Small</p>
            <p className="tw:xs:text-xs tw:text-xs tw:m-0">Small</p>
            <p className="tw:xs:text-xs tw:text-xs tw:m-0">Small</p>
            <p className="tw:xs:text-xs tw:text-xs tw:m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              nam repellat aliquam dolore expedita obcaecati
            </p>
          </div>
          <div className="tw:mt-12">
            <p className="tw:xs:text-xl tw:text-lg tw:m-0">Chart</p>
            <p className="tw:xs:text-xl tw:text-lg tw:m-0">Chart</p>
            <p className="tw:xs:text-xl tw:text-lg tw:m-0">Chart</p>
            <p className="tw:xs:text-xl tw:text-lg tw:m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              nam repellat aliquam dolore expedita obcaecati
            </p>
          </div>
          <div className="tw:mt-12">
            <p className="tw:xs:text-xl tw:font-bold tw:text-lg tw:m-0">
              Chart Bold
            </p>
            <p className="tw:xs:text-xl tw:font-bold tw:text-lg tw:m-0">
              Chart Bold
            </p>
            <p className="tw:xs:text-xl tw:font-bold tw:text-lg tw:m-0">
              Chart Bold
            </p>
            <p className="tw:xs:text-xl tw:font-bold tw:text-lg tw:m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              nam repellat aliquam dolore expedita obcaecati
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
