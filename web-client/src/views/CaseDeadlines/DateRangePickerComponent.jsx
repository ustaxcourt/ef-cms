import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import datePicker from '../../../../node_modules/uswds/src/js/components/date-picker';
import dateRangePicker from '../../../../node_modules/uswds/src/js/components/date-range-picker';

export const DateRangePickerComponent = ({
  endLabel,
  endName,
  endPickerCls,
  onChangeEnd,
  onChangeStart,
  pickerSpacer,
  rangePickerCls,
  startLabel,
  startName,
  startPickerCls,
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
    if (startDateInputRef.current && endDateInputRef.current) {
      startDateInputRef.current.addEventListener('change', onChangeStart);
      endDateInputRef.current.addEventListener('change', onChangeEnd);
    }
  }, [startDateInputRef, endDateInputRef]);

  const Spacer = pickerSpacer;

  return (
    <div ref={dateRangePickerRef}>
      <div className={classNames('usa-date-range-picker', rangePickerCls)}>
        <div
          className={classNames(startPickerCls || 'usa-form-group')}
          ref={startDatePickerRef}
        >
          <label
            className="usa-label"
            htmlFor={`${startName}-date-start`}
            id={`${startName}-date-start-label`}
          >
            {startLabel || 'Start date'}
          </label>
          <div className="usa-hint" id={`${startName}-date-start-hint`}>
            MM/DD/YYYY
          </div>
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
        </div>

        {Spacer && <Spacer />}

        <div
          className={classNames(endPickerCls || 'usa-form-group')}
          ref={endDatePickerRef}
        >
          <label
            className="usa-label"
            htmlFor={`${endName}-date-end`}
            id={`${endName}-date-end-label`}
          >
            {endLabel || 'End date'}
          </label>
          <div className="usa-hint" id={`${endName}-date-end-hint`}>
            MM/DD/YYYY
          </div>
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
        </div>
      </div>
    </div>
  );
};
