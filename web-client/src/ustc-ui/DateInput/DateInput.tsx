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
}: {
  className?: any;
  errorText?: string;
  minDate?: string;
  names?: {
    day: string;
    month: string;
    year: string;
  };
  id: string;
  hintText?: string | undefined;
  label: string;
  placeholder?: string;
  showDateHint?: boolean;
  titleHintText?: string;
  useHintNoWrap?: boolean;
  hideLegend?: boolean;
  onBlur?: () => void;
  onChange?: () => void;
  onValueChange?: () => void;
  optional?: boolean;
  values: null | {
    day: string;
    month: string;
    year: string;
  };
  shouldClearHiddenInput?: boolean;
  disabled?: boolean;
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
