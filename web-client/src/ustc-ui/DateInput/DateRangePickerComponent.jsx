import { FormGroup } from '../FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import datePicker from '../../../../node_modules/uswds/src/js/components/date-picker';
import dateRangePicker from '../../../../node_modules/uswds/src/js/components/date-range-picker';

export const DateRangePickerComponent = ({
  endDateErrorText,
  endDateOptional,
  endLabel,
  endName,
  endPickerCls,
  endValue,
  onChangeEnd,
  onChangeStart,
  pickerSpacer,
  rangePickerCls,
  showHint,
  startDateErrorText,
  startDateOptional,
  startLabel,
  startName,
  startPickerCls,
  startValue,
}) => {
  const dateRangePickerRef = useRef();
  const startDatePickerRef = useRef();
  const endDatePickerRef = useRef();

  const startDateInputRef = useRef();
  const endDateInputRef = useRef();

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
    );
    const startHiddenInput = window.document.querySelector(
      `input[name="${startName}-date-start"]`,
    );
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
    const endInput = window.document.getElementById(`${endName}-date-end`);
    const endHiddenInput = window.document.querySelector(
      `input[name="${endName}-date-end"]`,
    );
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
      window.document
        .getElementById(`${endName}-date-end`)
        .addEventListener('change', onChangeEnd);
      window.document
        .getElementById(`${startName}-date-start`)
        .addEventListener('change', onChangeStart);
    }
  }, [startDateInputRef, endDateInputRef]);

  const Spacer = pickerSpacer;
  const displayHint = showHint !== undefined ? showHint : true;

  return (
    <FormGroup formGroupRef={dateRangePickerRef}>
      <div className={classNames('usa-date-range-picker', rangePickerCls)}>
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
              {startDateOptional && (
                <span className="usa-hint">(optional)</span>
              )}
            </label>
            {displayHint && (
              <div className="usa-hint" id={`${startName}-date-start-hint`}>
                MM/DD/YYYY
              </div>
            )}
            <div className="usa-date-picker">
              <input
                aria-describedby={`${startName}-date-start-label ${startName}-date-start-hint`}
                className="usa-input"
                id={`${startName}-date-start`}
                name={`${startName}-date-start`}
                ref={startDateInputRef}
                type="text"
              />
            </div>
          </FormGroup>
        </div>

        {Spacer && <Spacer />}

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
              {endDateOptional && <span className="usa-hint">(optional)</span>}
            </label>
            {displayHint && (
              <div className="usa-hint" id={`${endName}-date-end-hint`}>
                MM/DD/YYYY
              </div>
            )}
            <div className="usa-date-picker">
              <input
                aria-describedby={`${endName}-date-end-label ${endName}-date-end-hint`}
                className="usa-input"
                id={`${endName}-date-end`}
                name={`${endName}-date-end`}
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
