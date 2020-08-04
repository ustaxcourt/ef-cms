import React, { useEffect, useRef } from 'react';
import datePicker from '../../../../node_modules/uswds/src/js/components/date-picker';

export const DatePickerComponent = ({ label, name, onChange }) => {
  useEffect(() => {
    if (datePickerRef.current) {
      datePicker.on(datePickerRef.current);
    }
  }, [datePickerRef]);

  const datePickerRef = useRef();

  return (
    <>
      <div className="usa-form-group" ref={datePickerRef}>
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
            id={`${name}-date`}
            name={`${name}-date`}
            type="text"
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
};
