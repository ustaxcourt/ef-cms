import { BigHeader } from '@web-client/views/BigHeader';
import React from 'react';
import { Buttons } from '@web-client/views/Public/DawsonLibrary/Buttons';
import { Alerts } from '@web-client/views/Public/DawsonLibrary/Alerts';
import { Tags } from '@web-client/views/Public/DawsonLibrary/Tags';
import { Inputs } from '@web-client/views/Public/DawsonLibrary/Inputs';
import { PieGraph } from './PieGraph';

export const DawsonLibrary = () => {
  return (
    <>
      <BigHeader text="Dawson Library" />
      <PieGraph
        rotation={25}
        data={[
          { label: 'Type A', value: 92.5 },
          { label: 'Type B', value: 7.5 },
        ]}
        title="Sample Distribution 1"
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
