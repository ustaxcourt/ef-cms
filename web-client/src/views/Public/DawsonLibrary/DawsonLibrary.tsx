import { BigHeader } from '@web-client/views/BigHeader';
import React from 'react';
import { Buttons } from '@web-client/views/Public/DawsonLibrary/Buttons';
import {
  MainCard,
  RoleCard,
  sampleCardContent,
} from '@web-client/dawson-ui/ui/card';
import { Alerts } from '@web-client/views/Public/DawsonLibrary/Alerts';
import { Tags } from '@web-client/views/Public/DawsonLibrary/Tags';

export const DawsonLibrary = () => {
  return (
    <>
      <BigHeader text="Dawson Library" />
      <div className="card margin-2 padding-2">
        <Buttons />
        <Alerts />
        <Tags />
        <MainCard content={sampleCardContent} />
        <RoleCard
          name="Name"
          role="Role"
          content={sampleCardContent}
        >
          First fiield</RoleCard>
      </div>
    </>
  );
};
