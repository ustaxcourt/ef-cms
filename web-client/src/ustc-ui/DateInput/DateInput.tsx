import { DatePickerComponent } from './DatePickerComponent';
import React from 'react';

export const DateInput = ({
  className,
  disabled,
  errorText,
  hideLegend,
  hintText,
  id,
  label,
  minDate,
  names = {
    day: 'day',
    month: 'month',
    year: 'year',
  },
  onBlur = () => {},
  onChange = () => {},
  onValueChange = () => {},
  optional,
  placeholder,
  shouldClearHiddenInput,
  showDateHint,
  titleHintText,
  useHintNoWrap,
  values = null,
}) => {
  return (
    <DatePickerComponent
      className={className}
      disabled={disabled}
      errorText={errorText}
      hideLegend={hideLegend}
      hintText={hintText}
      label={label}
      minDate={minDate}
      name={id}
      names={names}
      optional={optional}
      placeholder={placeholder}
      shouldClearHiddenInput={shouldClearHiddenInput}
      showDateHint={showDateHint}
      titleHintText={titleHintText}
      useHintNoWrap={useHintNoWrap}
      values={values}
      onBlur={onBlur}
      onChange={onChange}
      onValueChange={onValueChange}
    />
  );
};

DateInput.displayName = 'DateInput';
