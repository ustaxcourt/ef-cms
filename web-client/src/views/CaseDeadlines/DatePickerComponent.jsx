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
    if (values && values.month && values.day && values.year) {
      document.getElementById(
        `${name}-date`,
      ).value = `${values.month}/${values.day}/${values.year}`;
    }
  }, [values]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('change', e => {
        if (values) {
          const [year, month, day] = e.target.value.split('-');
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
    }
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
      <div className="usa-date-picker">
        <input
          aria-describedby={`${name}-date-label ${name}-date-hint`}
          className="usa-input"
          defaultValue={
            values ? `${values.month}/${values.day}/${values.year}` : value
          }
          id={`${name}-date`}
          name={`${name}-date`}
          ref={inputRef}
          type="text"
        />
      </div>
    </FormGroup>
  );
};
