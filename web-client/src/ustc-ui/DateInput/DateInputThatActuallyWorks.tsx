import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import datePicker from '../../../../node_modules/@uswds/uswds/packages/usa-date-picker/src';

export const DateInputThatActuallyWorks = ({
  defaultValue,
  errorText,
  formGroupClassNames,
  id,
  label,
  onChange,
}) => {
  const formGroupInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formGroupInputRef.current) {
      /**
       * The way USWDS date-picker works is it'll search the page for a usa-date-picker and
       * modify the dom by inserting another input.  This causes a hidden input called
       * usa-date-picker__input-input to be created in place of the input defined in this
       * JSX file, and also a usa-date-picker__external-input which is the one that the users
       * see in the UI and can type into.  This effect hooks into that visible input so that
       * we can get the actual visible value of the input.
       */
      datePicker.on(formGroupInputRef.current);
      const myDatePicker = formGroupInputRef.current.querySelector(
        `#${id}-picker.usa-date-picker__external-input`,
      );
      if (!myDatePicker) throw new Error('could not find expected date picker');
      myDatePicker.addEventListener('change', onChange);
      myDatePicker.addEventListener('input', onChange);
    }
  }, [formGroupInputRef]);

  return (
    <FormGroup
      className={formGroupClassNames}
      errorText={errorText}
      formGroupRef={formGroupInputRef}
    >
      <label
        className="usa-label"
        htmlFor={`${id}-picker`}
        id={`${id}-date-picker-label`}
      >
        {label}
      </label>
      <div className="usa-date-picker" data-default-value={defaultValue}>
        <input
          aria-labelledby="date-picker-label"
          className="usa-input"
          id={`${id}-picker`}
          name={`${id}-date-picker`}
          type="text"
        />
      </div>
    </FormGroup>
  );
};

DateInputThatActuallyWorks.displayName = 'DateInputThatActuallyWorks';
