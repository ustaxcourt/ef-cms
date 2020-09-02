import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import datePicker from '../../../../node_modules/uswds/src/js/components/date-picker';

export const DatePickerComponent = ({
  className,
  errorText,
  hideLegend,
  label,
  name,
  names,
  onBlur,
  onChange,
  optional,
  value = '',
  values,
}) => {
  const datePickerRef = useRef();
  const inputRef = useRef();
  // YYYY-MM-DD is indeed the format required by `data-default-value`
  const defaultValue = values
    ? `${values.year}-${values.month}-${values.day}`
    : value;
  useEffect(() => {
    if (datePickerRef.current) {
      datePicker.on(datePickerRef.current);
    }
  }, [datePickerRef]);

  useEffect(() => {
    const input = document.getElementById(`${name}-date`);
    if (!input) return;
    if (value.indexOf('-') > -1) {
      const [year, month, day] = value.split('-');
      input.value = `${month}/${day}/${year}`;
    } else {
      input.value = value;
    }
  }, [value]);

  useEffect(() => {
    const input = document.getElementById(`${name}-date`);
    if (!input) return;
    if (values && values.month && values.day && values.year) {
      input.value = `${values.month}/${values.day}/${values.year}`;
    }
  }, [values]);

  const splitDate = dateString => {
    if (dateString.includes('/')) {
      return dateString.split('/');
    } else if (dateString.includes('-')) {
      return dateString.split('-');
    } else {
      return [dateString, null, null];
    }
  };

  // inputRef evaluates to undefined when the date value does not match MM/DD/YYY or MM-DD-YYY,
  // which is why we need to get the input element by ID
  useEffect(() => {
    const input = document.getElementById(`${name}-date`) || inputRef.current;
    input.addEventListener('change', e => {
      if (values) {
        const [month, day, year] = splitDate(e.target.value);
        onChange({
          key: names.day,
          value: day,
        });
        onChange({
          key: names.month,
          value: month,
        });
        onChange({
          key: names.year,
          value: year,
        });
        onBlur();
      } else {
        onChange(e);
        onBlur();
      }
    });
  }, [inputRef]);

  return (
    <FormGroup
      className={className}
      errorText={errorText}
      formGroupRef={datePickerRef}
    >
      <label
        className={classNames('usa-label', hideLegend && 'usa-sr-only')}
        htmlFor={`${name}-date`}
        id={`${name}-date-label`}
      >
        {label} {optional && <span className="usa-hint">(optional)</span>}
      </label>
      <div className="usa-hint" id={`${name}-date-hint`}>
        MM/DD/YYYY
      </div>
      <div className="usa-date-picker" data-default-value={defaultValue}>
        <input
          aria-describedby={`${name}-date-label ${name}-date-hint`}
          className="usa-input"
          id={`${name}-date`}
          name={`${name}-date`}
          ref={inputRef}
          type="text"
        />
      </div>
    </FormGroup>
  );
};
