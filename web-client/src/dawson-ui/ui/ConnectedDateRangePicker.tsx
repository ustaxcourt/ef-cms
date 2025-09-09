import React from 'react';

import { DateRangePicker } from './DateRangePicker';
import { applicationContext } from '@web-client/applicationContext';

interface ConnectedDateRangePickerProps {
  startValue?: string;
  endValue?: string;
  startLabel?: string | React.ReactNode;
  endLabel?: string | React.ReactNode;
  startName?: string;
  endName?: string;
  startDateErrorText?: string;
  endDateErrorText?: string;
  maxDate?: string;
  minDate?: string;
  showDateHint?: boolean;
  updateSequence?: Function;
  validateSequence?: Function;
  className?: string;
  startPickerCls?: string;
  endPickerCls?: string;
  rangePickerCls?: string;
  formGroupCls?: string;
  formGroupStartCls?: string;
  formGroupEndCls?: string;
  omitFormGroupClass?: boolean;
  parentModalHasMounted?: boolean;
}

export function ConnectedDateRangePicker({
  startValue,
  endValue,
  startLabel,
  endLabel,
  startName,
  endName,
  startDateErrorText,
  endDateErrorText,
  maxDate,
  minDate,
  showDateHint = false,
  updateSequence,
  validateSequence,
  ...restProps
}: Readonly<ConnectedDateRangePickerProps>) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSequence?.({
      key: event.target.name,
      value: event.target.value,
    });

    // When a date is selected, also set dateRange to 'customDates'
    if (event.target.name === 'startDate' || event.target.name === 'endDate') {
      updateSequence?.({
        key: 'dateRange',
        value:
          applicationContext.getConstants().DATE_RANGE_SEARCH_OPTIONS
            .CUSTOM_DATES,
      });
    }

    validateSequence?.();
  };

  return (
    <DateRangePicker
      startValue={startValue}
      endValue={endValue}
      startLabel={startLabel}
      endLabel={endLabel}
      startName={startName}
      endName={endName}
      startDateErrorText={startDateErrorText}
      endDateErrorText={endDateErrorText}
      maxDate={maxDate}
      minDate={minDate}
      showDateHint={showDateHint}
      onChangeStart={handleChange}
      onChangeEnd={handleChange}
      onBlurStart={handleChange}
      onBlurEnd={handleChange}
      {...restProps}
    />
  );
}

ConnectedDateRangePicker.displayName = 'ConnectedDateRangePicker';
