import { FormGroup } from '../FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import datePicker from '../../../../node_modules/uswds/src/js/components/date-picker';

export const DatePickerComponent = ({
  className,
  disabled = false,
  errorText,
  hideLegend,
  hintText,
  label,
  minDate,
  name,
  names,
  onBlur,
  onChange,
  optional,
  placeholder,
  showDateHint = true,
  titleHintText,
  useHintNoWrap,
  values,
}) => {
  const datePickerRef = useRef();
  const inputRef = useRef();

  // YYYY-MM-DD is indeed the format required by `data-default-value`
  const defaultValue = `${values.year}-${values.month}-${values.day}`;

  useEffect(() => {
    if (datePickerRef.current) {
      datePicker.on(datePickerRef.current);
    }
  }, [datePickerRef]);

  useEffect(() => {
    const input = datePickerRef.current.querySelector('.usa-date-picker');

    if (disabled) {
      datePicker.disable(input);
    } else {
      datePicker.enable(input);
    }
  });

  useEffect(() => {
    if (!datePickerRef.current) return;
    const input = datePickerRef.current.querySelector('input');
    if (!input) return;
    if (values.month && values.day && values.year) {
      input.value = `${values.month}/${values.day}/${values.year}`;
    } else {
      input.value = null;
    }
  }, [datePickerRef, values]);

  const splitDate = dateString => {
    if (dateString.includes('/')) {
      return dateString.split('/');
    } else if (dateString.includes('-')) {
      return dateString.split('-');
    } else {
      return [dateString, null, null];
    }
  };

  /**when using a modal, document.getElementById does not successfully find the
   date input, causing us to use inputRef. However, inputRef does not return the date in the expected format
   (MM/DD/YYY) but instead returns it as YYY/MM/DD **/

  useEffect(() => {
    const input =
      window.document.getElementById(`${name}-date`) || inputRef.current;

    input.addEventListener('change', e => {
      if (values) {
        let [month, day, year] = splitDate(e.target.value);
        if (month.length > 2) {
          [year, month, day] = splitDate(e.target.value);
        }
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
        {titleHintText && <span className="usa-hint">{titleHintText}</span>}
      </label>
      {showDateHint && (
        <div className="usa-hint" id={`${name}-date-hint`}>
          MM/DD/YYYY
        </div>
      )}
      <div
        className="usa-date-picker"
        data-default-value={defaultValue}
        data-min-date={minDate}
      >
        <input
          aria-describedby={`${name}-date-label ${name}-date-hint`}
          className="usa-input grey-placeholder"
          id={`${name}-date`}
          name={`${name}-date`}
          placeholder={placeholder}
          ref={inputRef}
          type="text"
        />
      </div>
      {hintText && (
        <span
          className={classNames('usa-hint', 'margin-top-2', {
            'no-wrap': useHintNoWrap,
          })}
        >
          {hintText}
        </span>
      )}
    </FormGroup>
  );
};
