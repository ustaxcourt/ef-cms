import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React, { useEffect, useRef } from 'react';
import datePicker from 'uswds/src/js/components/date-picker';
import dateRangePicker from 'uswds/src/js/components/date-range-picker';

export const SearchDateRangePickerComponent = connect(
  {
    validationErrors: state.validationErrors,
  },
  function SearchDateRangePickerComponent({
    endDateErrorText,
    endValue,
    onChangeEnd,
    onChangeStart,
    startValue,
    validationErrors,
  }) {
    const dateRangePickerRef = useRef();
    const startDatePickerRef = useRef();
    const endDatePickerRef = useRef();

    const startDateInputRef = useRef();
    const endDateInputRef = useRef();

    useEffect(() => {
      if (startDatePickerRef.current && endDatePickerRef.current) {
        datePicker.on(startDatePickerRef.current);
        datePicker.on(endDatePickerRef.current);
        dateRangePicker.on(dateRangePickerRef.current);
      }
    }, [dateRangePickerRef]);

    useEffect(() => {
      const startInput = window.document.getElementById('startDate-date-start');
      const startHiddenInput = window.document.querySelector(
        'input[name="startDate-date-start"]',
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
      const endInput = window.document.getElementById('endDate-date-end');
      const endHiddenInput = window.document.querySelector(
        'input[name="endDate-date-end"]',
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
          .getElementById('endDate-date-end')
          .addEventListener('change', onChangeEnd);
        window.document
          .getElementById('startDate-date-start')
          .addEventListener('change', onChangeStart);
      }
    }, [startDateInputRef, endDateInputRef]);

    return (
      <div className="usa-date-range-picker grid-row grid-gap-lg">
        <FormGroup
          errorText={
            validationErrors.dateRangeRequired || validationErrors.startDate
          }
          formGroupRef={startDatePickerRef}
        >
          <label
            className="usa-label"
            htmlFor="startDate-date-start"
            id="startDate-date-start-label"
          >
            Start date
          </label>
          <div className="usa-hint" id="startDate-date-start-hint">
            MM/DD/YYYY
          </div>
          <div className="usa-date-picker">
            <input
              aria-describedby="startDate-date-start-label startDate-date-start-hint"
              className="usa-input"
              id="startDate-date-start"
              name="startDate-date-start"
              ref={startDateInputRef}
              type="text"
            />
          </div>
        </FormGroup>

        <FormGroup errorText={endDateErrorText} formGroupRef={endDatePickerRef}>
          <label
            className="usa-label"
            htmlFor="endDate-date-end"
            id="endDate-date-end-label"
          >
            End date
          </label>
          <div className="usa-hint" id="endDate-date-end-hint">
            MM/DD/YYYY
          </div>
          <div className="usa-date-picker">
            <input
              aria-describedby="endDate-date-end-label endDate-date-end-hint"
              className="usa-input"
              id="endDate-date-end"
              name="endDate-date-end"
              ref={endDateInputRef}
              type="text"
            />
          </div>
        </FormGroup>
      </div>
    );
  },
);
