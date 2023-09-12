import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import datePicker from '../../../../node_modules/@uswds/uswds/packages/usa-date-picker/src';

export const DateInputThatActuallyWorks = ({ errorText, onChange }) => {
  const formGroupInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dateInputRef.current) {
      const datePickerInput = dateInputRef.current.getRootNode();

      datePickerInput.addEventListener('change', onChange);
      datePickerInput.addEventListener('input', onChange);
    }
  }, [dateInputRef]);

  useEffect(() => {
    if (formGroupInputRef.current) {
      datePicker.on(formGroupInputRef.current);
    }
  }, [formGroupInputRef]);

  return (
    <FormGroup errorText={errorText} formGroupRef={formGroupInputRef}>
      <label
        className="usa-label"
        htmlFor="appointment-date"
        id="appointment-date-label"
      >
        Appointment date
      </label>
      <div className="usa-date-picker">
        <input
          aria-labelledby="appointment-date-label"
          className="usa-input"
          id="appointment-date"
          name="appointment-date"
          ref={dateInputRef}
          type="text"
        />
      </div>
    </FormGroup>
  );
};

DateInputThatActuallyWorks.displayName = 'DateInputThatActuallyWorks';
