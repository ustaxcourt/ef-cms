import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import datePicker from '../../../../node_modules/@uswds/uswds/packages/usa-date-picker/src';

export const DateInputThatActuallyWorks = ({
  defaultValue,
  errorText,
  formGroupClassNames,
  label,
  onChange,
}) => {
  const formGroupInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dateInputRef.current) {
      // const datePickerInput = dateInputRef.current.getRootNode();
      console.log(dateInputRef.current.value, '&&&&');
      dateInputRef.current.addEventListener('change', onChange);
      dateInputRef.current.addEventListener('input', onChange);
    }
  }, [dateInputRef]);

  useEffect(() => {
    if (formGroupInputRef.current) {
      datePicker.on(formGroupInputRef.current);
    }
  }, [formGroupInputRef]);

  return (
    <FormGroup
      className={formGroupClassNames}
      errorText={errorText}
      formGroupRef={formGroupInputRef}
    >
      <label className="usa-label" htmlFor="date-picker" id="date-picker-label">
        {label}
      </label>
      <div className="usa-date-picker" data-default-value={defaultValue}>
        <input
          aria-labelledby="date-picker-label"
          className="usa-input"
          data-hello="world"
          id="date-picker"
          name="date-picker"
          ref={dateInputRef}
          type="text"
        />
      </div>
    </FormGroup>
  );
};

DateInputThatActuallyWorks.displayName = 'DateInputThatActuallyWorks';
