import { FormGroup } from '../FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import datePicker from '../../../../node_modules/@uswds/uswds/packages/usa-date-picker/src';
import dateRangePicker from '../../../../node_modules/@uswds/uswds/packages/usa-date-range-picker/src';

export const DateRangePickerComponent = ({
  endDateErrorText,
  endLabel,
  endName,
  endPickerCls,
  endValue,
  formGroupCls,
  maxDate,
  omitFormGroupClass,
  onChangeEnd,
  onChangeStart,
  rangePickerCls,
  showDateHint = false,
  startDateErrorText,
  startLabel,
  startName,
  startPickerCls,
  startValue,
}: {
  showDateHint?: boolean;
  endDateErrorText?: string;
  endLabel?: string | React.ReactNode;
  endName: string;
  endPickerCls?: string;
  endValue: string;
  formGroupCls?: string;
  rangePickerCls?: string;
  onChangeEnd: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeStart: (event: React.ChangeEvent<HTMLInputElement>) => void;
  startDateErrorText?: string;
  startPickerCls?: string;
  startLabel?: string | React.ReactNode;
  omitFormGroupClass?: boolean;
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
      `input[aria-describedby="${startName}-date-start-label ${startName}-date-start-hint"]`,
    ) as HTMLInputElement;

    if (!startValue && startInput) {
      startInput.value = '';
      startHiddenInput.value = '';
      // This is used to force USWDS to update it's internal state
      const backspaceEvent = new CustomEvent('change', {
        bubbles: true,
        cancelable: true,
        detail: { value: '' },
      });
      startInput.dispatchEvent(backspaceEvent);
      startHiddenInput.dispatchEvent(backspaceEvent);
    }

    if (startValue && startInput) {
      startInput.value = startValue;
      startHiddenInput.value = startValue;
    }
  }, [startValue]);

  useEffect(() => {
    const endInput = window.document.getElementById(
      `${endName}-date-end`,
    ) as HTMLInputElement;
    const endHiddenInput = window.document.querySelector(
      `input[aria-describedby="${endName}-date-end-label ${endName}-date-end-hint"]`,
    ) as HTMLInputElement;
    if (!endValue && endInput) {
      endInput.value = '';
      endHiddenInput.value = '';
      // This is used to force USWDS to update it's internal state
      const backspaceEvent = new CustomEvent('change', {
        bubbles: true,
        cancelable: true,
        detail: { value: '' },
      });
      endInput.dispatchEvent(backspaceEvent);
      endHiddenInput.dispatchEvent(backspaceEvent);
    }

    if (endValue && endInput) {
      endInput.value = endValue;
      endHiddenInput.value = endValue;
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
    <FormGroup
      className={formGroupCls}
      formGroupRef={dateRangePickerRef}
      omitFormGroupClass={omitFormGroupClass}
    >
      <div
        className={classNames('usa-date-range-picker', rangePickerCls)}
        data-max-date={maxDate}
      >
        <div className={startPickerCls} data-testid={`${startName}-date-start`}>
          <FormGroup
            errorText={startDateErrorText}
            formGroupRef={startDatePickerRef}
          >
            <label
              className="usa-label"
              data-testid={`${startName}-date-start-label`}
              htmlFor={`${startName}-date-start`}
              id={`${startName}-date-start-label`}
            >
              {startLabel || 'Start date'}{' '}
            </label>
            {showDateHint && <span className="usa-hint">MM/DD/YYYY</span>}
            <div className="usa-date-picker">
              <input
                aria-describedby={`${startName}-date-start-label ${startName}-date-start-hint`}
                className="usa-input"
                data-testid={`${startName}-date-start-input`}
                id={`${startName}-date-start`}
                name={`${startName}-date-start`}
                placeholder={showDateHint ? '' : 'MM/DD/YYYY'}
                ref={startDateInputRef}
                type="text"
              />
            </div>
          </FormGroup>
        </div>

        <div className={endPickerCls} data-testid={`${endName}-date-end}`}>
          <FormGroup
            errorText={endDateErrorText}
            formGroupRef={endDatePickerRef}
          >
            <label
              className="usa-label"
              data-testid={`${endName}-date-end-label`}
              htmlFor={`${endName}-date-end`}
              id={`${endName}-date-end-label`}
            >
              {endLabel || 'End date'}{' '}
            </label>
            {showDateHint && <span className="usa-hint">MM/DD/YYYY</span>}
            <div className="usa-date-picker">
              <input
                aria-describedby={`${endName}-date-end-label ${endName}-date-end-hint`}
                className="usa-input"
                data-testid={`${endName}-date-end-input}`}
                id={`${endName}-date-end`}
                name={`${endName}-date-end`}
                placeholder={showDateHint ? '' : 'MM/DD/YYYY'}
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
