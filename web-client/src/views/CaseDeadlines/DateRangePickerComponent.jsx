import { DatePickerComponent } from './DatePickerComponent';
import React from 'react';

export const DateRangePickerComponent = ({
  endLabel,
  endName,
  onChangeEnd,
  onChangeStart,
  startLabel,
  startName,
}) => {
  return (
    <>
      <div className="usa-date-range-picker">
        <DatePickerComponent
          label={startLabel || 'Start date'}
          name={startName || 'start'}
          onChange={onChangeStart}
        />
        <DatePickerComponent
          label={endLabel || 'End date'}
          name={endName || 'end'}
          onChange={onChangeEnd}
        />
      </div>
    </>
  );
};
