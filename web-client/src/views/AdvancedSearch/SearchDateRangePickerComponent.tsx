import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import datePicker from '../../../../node_modules/@uswds/uswds/packages/usa-date-picker/src';
import dateRangePicker from '../../../../node_modules/@uswds/uswds/packages/usa-date-range-picker/src';

export const SearchDateRangePickerComponent = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    validationErrors: state.validationErrors,
  },
  function SearchDateRangePickerComponent({
    advancedSearchForm,
    formType,
    updateSequence,
    validateSequence,
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

      if (advancedSearchForm[formType].startDate && startInput) {
        startInput.value = advancedSearchForm[formType].startDate;
        startHiddenInput.value = advancedSearchForm[formType].startDate;
      }

      if (!advancedSearchForm[formType].startDate && startInput) {
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
    }, [advancedSearchForm[formType].startDate]);

    useEffect(() => {
      const endInput = window.document.getElementById('endDate-date-end');
      const endHiddenInput = window.document.querySelector(
        'input[name="endDate-date-end"]',
      );

      if (advancedSearchForm[formType].endDate && endInput) {
        endInput.value = advancedSearchForm[formType].endDate;
        endHiddenInput.value = advancedSearchForm[formType].endDate;
      }

      if (!advancedSearchForm[formType].endDate && endInput) {
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
    }, [advancedSearchForm[formType].endDate]);

    useEffect(() => {
      if (startDateInputRef.current && endDateInputRef.current) {
        window.document
          .getElementById('endDate-date-end')
          .addEventListener('change', e => {
            updateSequence({
              key: 'endDate',
              value: e.target.value,
            });
            validateSequence();
          });
        window.document
          .getElementById('startDate-date-start')
          .addEventListener('change', e => {
            updateSequence({
              key: 'startDate',
              value: e.target.value,
            });
            validateSequence();
          });
      }
    }, [startDateInputRef, endDateInputRef]);

    return (
      <>
        <FormGroup
          className="width-card-lg"
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
            Start date{' '}
            <span className="usa-hint" id="startDate-date-start-hint">
              (MM/DD/YYYY)
            </span>
          </label>
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
        <div className="desktop:text-center tablet:padding-top-6 width-full tablet:width-auto desktop:margin-bottom-2 padding-right-2 tiny-to">
          to
        </div>
        <FormGroup
          className="width-card-lg tablet:padding-top-0 padding-top-5"
          errorText={
            validationErrors.dateRangeRequired || validationErrors.endDate
          }
          formGroupRef={endDatePickerRef}
        >
          <label
            className="usa-label"
            htmlFor="endDate-date-end"
            id="endDate-date-end-label"
          >
            End date{' '}
            <span className="usa-hint" id="endDate-date-end-hint">
              (MM/DD/YYYY)
            </span>
          </label>

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
      </>
    );
  },
);

SearchDateRangePickerComponent.displayName = 'SearchDateRangePickerComponent';
