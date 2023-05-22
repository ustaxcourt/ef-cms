import { FormGroup } from '../FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import datePicker from '../../../../node_modules/uswds/src/js/components/date-picker';
import dateRangePicker from '../../../../node_modules/uswds/src/js/components/date-range-picker';

export const DateRangePickerComponent = ({
  endDateErrorText,
  endLabel,
  endName,
  endPickerCls,
  endValue,
  formGroupCls,
  maxDate,
  onChangeEnd,
  onChangeStart,
  rangePickerCls,
  startDateErrorText,
  startLabel,
  startName,
  startPickerCls,
  startValue,
}: {
  endDateErrorText?: string;
  endLabel?: string;
  endName: string;
  endPickerCls?: string;
  endValue: string;
  formGroupCls?: string;
  rangePickerCls?: string;
  onChangeEnd: (event: CustomEvent) => void;
  onChangeStart: (event: CustomEvent) => void;
  startDateErrorText?: string;
  startPickerCls?: string;
  startLabel?: string;
  startName: string;
  startValue: string;
  maxDate?: string; // Must be in YYYY-MM-DD format
}) => {
  const dateRangePickerRef = useRef();
  const startDatePickerRef = useRef();
  const endDatePickerRef = useRef();

  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      startDatePickerRef.current &&
      endDatePickerRef.current &&
      dateRangePickerRef.current
    ) {
      datePicker.on(startDatePickerRef.current);
      datePicker.on(endDatePickerRef.current);
      dateRangePicker.on(dateRangePickerRef.current);
    }
  }, [dateRangePickerRef]);

  useEffect(() => {
    const startInput = window.document.getElementById(
      `${startName}-date-start`,
    ) as HTMLInputElement;
    const startHiddenInput = window.document.querySelector(
      `input[name="${startName}-date-start"]`,
    ) as HTMLInputElement;
    if (!startValue && startInput) {
      startInput.value = '';
      startHiddenInput.value = '';
      const backspaceEvent = new CustomEvent('change', {
        bubbles: true,
        cancelable: true,
        detail: { value: '' },
      });
      startInput.dispatchEvent(backspaceEvent);
      startHiddenInput.dispatchEvent(backspaceEvent);
    }
  }, [startValue]);

  useEffect(() => {
    const endInput = window.document.getElementById(
      `${endName}-date-end`,
    ) as HTMLInputElement;
    const endHiddenInput = window.document.querySelector(
      `input[name="${endName}-date-end"]`,
    ) as HTMLInputElement;
    if (!endValue && endInput) {
      endInput.value = '';
      endHiddenInput.value = '';
      const backspaceEvent = new CustomEvent('change', {
        bubbles: true,
        cancelable: true,
        detail: { value: '' },
      });
      endInput.dispatchEvent(backspaceEvent);
      endHiddenInput.dispatchEvent(backspaceEvent);
    }
  }, [endValue]);

  useEffect(() => {
    if (startDateInputRef.current && endDateInputRef.current) {
      const dateEndInput = window.document.getElementById(
        `${endName}-date-end`,
      );
      if (dateEndInput) {
        dateEndInput.addEventListener('change', onChangeEnd);
        dateEndInput.addEventListener('input', onChangeEnd);
      }
      const dateStartInput = window.document.getElementById(
        `${startName}-date-start`,
      );
      if (dateStartInput) {
        dateStartInput.addEventListener('change', onChangeStart);
        dateStartInput.addEventListener('input', onChangeStart);
      }
    }
  }, [startDateInputRef, endDateInputRef]);

  return (
    <FormGroup className={formGroupCls} formGroupRef={dateRangePickerRef}>
      <div
        className={classNames('usa-date-range-picker', rangePickerCls)}
        data-max-date={maxDate}
      >
        <div className={startPickerCls}>
          <FormGroup
            errorText={startDateErrorText}
            formGroupRef={startDatePickerRef}
          >
            <label
              className="usa-label"
              htmlFor={`${startName}-date-start`}
              id={`${startName}-date-start-label`}
            >
              {startLabel || 'Start date'}{' '}
            </label>
            <div className="usa-date-picker">
              <input
                aria-describedby={`${startName}-date-start-label ${startName}-date-start-hint`}
                className="usa-input"
                id={`${startName}-date-start`}
                name={`${startName}-date-start`}
                placeholder="MM/DD/YYYY"
                ref={startDateInputRef}
                type="text"
              />
            </div>
          </FormGroup>
        </div>

        <div className={endPickerCls}>
          <FormGroup
            errorText={endDateErrorText}
            formGroupRef={endDatePickerRef}
          >
            <label
              className="usa-label"
              htmlFor={`${endName}-date-end`}
              id={`${endName}-date-end-label`}
            >
              {endLabel || 'End date'}{' '}
            </label>
            <div className="usa-date-picker">
              <input
                aria-describedby={`${endName}-date-end-label ${endName}-date-end-hint`}
                className="usa-input"
                id={`${endName}-date-end`}
                name={`${endName}-date-end`}
                placeholder="MM/DD/YYYY"
                ref={endDateInputRef}
                type="text"
              />
            </div>
          </FormGroup>
        </div>
      </div>
    </FormGroup>
  );
};

DateRangePickerComponent.displayName = 'DateRangePickerComponent';
