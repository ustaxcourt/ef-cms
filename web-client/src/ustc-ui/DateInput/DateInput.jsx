import { DatePickerComponent } from './DatePickerComponent';
import React from 'react';

export const DateInput = props => {
  const {
    minDate,
    errorText,
    id,
    disabled,
    className,
    label,
    onBlur = () => {},
    onChange = () => {},
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
  } = props;

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
    />
  );
};
