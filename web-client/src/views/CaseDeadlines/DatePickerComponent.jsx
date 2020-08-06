import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import datePicker from '../../../../node_modules/uswds/src/js/components/date-picker';

export const DatePickerComponent = ({
  errorText,
  label,
  name,
  names,
  onBlur,
  onChange,
  value = '',
  values,
}) => {
  const datePickerRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    if (datePickerRef.current) {
      datePicker.on(datePickerRef.current);

      if (values && values.month && values.day && values.year) {
        document.querySelector(
          `#${name}-date`,
        ).value = `${values.month}/${values.day}/${values.year}`;
      }
    }
  }, [datePickerRef]);

  useEffect(() => {
    document.querySelector(`#${name}-date`).value = value;
  }, [value]);

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
    <FormGroup errorText={errorText} formGroupRef={datePickerRef}>
      <label
        className="usa-label"
        htmlFor={`${name}-date`}
        id={`${name}-date-label`}
      >
        {label}
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
