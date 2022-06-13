import { DatePickerComponent } from './DatePickerComponent';
import React from 'react';

export const DateInput = props => {
  const {
    errorText,
    id,
    className,
    label,
    onBlur = () => {},
    onChange = () => {},
    placeholder,
    hideLegend,
    hintText,
    useHintNoWrap,
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
      errorText={errorText}
      hideLegend={hideLegend}
      hintText={hintText}
      label={label}
      name={id}
      names={names}
      optional={optional}
      placeholder={placeholder}
      showDateHint={showDateHint}
      titleHintText={titleHintText}
      useHintNoWrap={useHintNoWrap}
      values={values}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};
