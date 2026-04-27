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

export const DawsonLibrary = () => {
  return (
    <>
      <BigHeader text="Dawson Library" />
      <SingleBarGraph
        title="Created Special Sessions by Location"
        width={DEFAULT_CHART_WIDTH}
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
      <div className="tw:mt-12" />
      <MultiBarGraph
        width={DEFAULT_CHART_WIDTH}
        title="Total Petitions by Month"
        stacked
        showLabels={false}
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
        title="Closed/Closed - Dismissed &amp; Changed to On Appeal"
        // yAxisLabel="Total"
        showLabels={false}
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
      <div className="tw:mt-12" />
      <LineGraph
        width={DEFAULT_CHART_WIDTH}
        title="Cases Filed Over Time"
        xAxisLabel="Month"
        xLabelRotation={45}
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
            label: 'Regular Cases',
            data: [
              55,
              38,
              62,
              65,
              75,
              48,
              null,
              null,
              null,
              null,
              null,
              null,
            ] as (number | null)[],
          },
          {
            label: 'Small Tax Cases',
            data: [
              40,
              30,
              38,
              78,
              42,
              33,
              null,
              null,
              null,
              null,
              null,
              null,
            ] as (number | null)[],
          },
        ]}
        smooth
      />
      <div className="tw:mt-[6.25rem]" />
      <LineGraph
        width={DEFAULT_CHART_WIDTH}
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
      <div className="tw:mt-12 tw:mx-4">
        <h2 className="tw:xs:text-2xl tw:text-lg tw:mb-4">
          Total sessions scheduled: 300
        </h2>
        <div className="tw:flex tw:flex-wrap tw:gap-12">
          <PieGraph
            title="Procedure Type"
            data={[
              { name: 'In Person', value: 75, color: '#005EA2' },
              {
                name: 'Remote',
                value: 25,
                color: '#FFBE2E',
              },
            ]}
          />

          <PieGraph
            title="Session Type"
            data={[
              { name: 'Regular', value: 40, color: '#B4D0B9' },
              { name: 'Hybrid', value: 8, color: '#FEE685' },
              { name: 'Small', value: 8, color: '#97D4EA' },
              { name: 'Hybrid-S', value: 2.5, color: '#F2938C' },
              { name: 'Motion/ Hearing', value: 2.5, color: '#D0C3E9' },
              { name: 'Special', value: 2.5, color: '#E5A000' },
            ]}
          />
        </div>
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
