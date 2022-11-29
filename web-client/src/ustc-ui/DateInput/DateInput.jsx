import { DatePickerComponent } from './DatePickerComponent';
import React from 'react';

export const DateInput = ({
  minDate,
  errorText,
  id,
  disabled,
  className,
  label,
  onBlur = () => {},
  onChange = () => {},
  onValueChange = () => {},
  placeholder,
  hideLegend,
  hintText,
  useHintNoWrap,
  shouldClearHiddenInput,
  showDateHint,
  titleHintText,
  optional,
  values = null,
  names = {
    day: 'day',
    month: 'month',
    year: 'year',
  },
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
