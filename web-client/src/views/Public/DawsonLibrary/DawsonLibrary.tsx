import { BigHeader } from '@web-client/views/BigHeader';
import React from 'react';
import { Buttons } from '@web-client/views/Public/DawsonLibrary/Buttons';
import { Alerts } from '@web-client/views/Public/DawsonLibrary/Alerts';
import { Tags } from '@web-client/views/Public/DawsonLibrary/Tags';
import { DateRangePicker } from './DatePicker';

export const DawsonLibrary = () => {
  return (
    <>
      <BigHeader text="Dawson Library" />
      <div className="card margin-2 padding-2">
        <Buttons />
        <Alerts />
        <Tags />
        <h2>Date Picker</h2>
        <div className="tw:flex tw:gap-4">
          <DateRangePicker startLabel={'Date Range'} mode={'range'} />
          <DateRangePicker startLabel={'Single Date'} mode={'single'} />
        </div>
      </div>
    </>
  );
};
