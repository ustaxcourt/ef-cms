import { DatePickerComponent } from '../../views/CaseDeadlines/DatePickerComponent';
import React from 'react';

export const DateInput = props => {
  const {
    errorText,
    id,
    label,
    onBlur = () => {},
    onChange = () => {},
    value,
    values = null,
    names = {
      day: 'day',
      month: 'month',
      year: 'year',
    },
  } = props;

  return (
    <DatePickerComponent
      errorText={errorText}
      label={label}
      name={id}
      names={names}
      value={value}
      values={values}
      onBlur={onBlur}
      onChange={onChange}
    />
  );
};
