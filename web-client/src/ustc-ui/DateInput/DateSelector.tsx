import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import datePicker from '../../../../node_modules/@uswds/uswds/packages/usa-date-picker/src';

export const DateSelector = ({
  defaultValue,
  disabled = false,
  displayOptionalHintText = false,
  errorText,
  formGroupClassNames,
  hintText = undefined,
  id,
  label,
  maxDate,
  minDate,
  onChange,
  placeHolderText,
  showDateHint = false,
}: {
  defaultValue: string | undefined;
  displayOptionalHintText?: boolean;
  placeHolderText?: string;
  errorText?: string;
  maxDate?: string;
  disabled?: boolean;
  formGroupClassNames?: string;
  minDate?: string;
  hintText?: string;
  id: string;
  label?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showDateHint?: boolean;
}) => {
  const datePickerId = `#${id}-picker.usa-date-picker__external-input`;
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
      const myDatePicker =
        formGroupInputRef.current.querySelector(datePickerId);

      if (!myDatePicker) throw new Error('could not find expected date picker');

      (myDatePicker as HTMLInputElement).addEventListener('change', onChange);
      (myDatePicker as HTMLInputElement).addEventListener('input', onChange);
    }
  }, [formGroupInputRef]);

  useEffect(() => {
    if (formGroupInputRef.current) {
      const input = formGroupInputRef.current.querySelector('.usa-date-picker');
      if (disabled) {
        const myDatePicker =
          formGroupInputRef.current.querySelector(datePickerId);

        if (!myDatePicker)
          throw new Error('could not find expected date picker');

        (myDatePicker as HTMLInputElement).value = '';

        datePicker.disable(input);
      } else {
        datePicker.enable(input);
      }
    }
  });

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
        {label}{' '}
        {displayOptionalHintText && (
          <span className="usa-hint">(optional)</span>
        )}
        {hintText && <span className="usa-hint">{hintText}</span>}
      </label>
      {showDateHint && (
        <div className="usa-hint" id={`${id}-date-hint`}>
          MM/DD/YYYY
        </div>
      )}
      <div
        className="usa-date-picker"
        data-default-value={defaultValue}
        data-max-date={maxDate}
        data-min-date={minDate}
      >
        <input
          aria-describedby={`date-picker-label ${id}-date-hint`}
          className="usa-input"
          data-testid={`${id}-picker`}
          id={`${id}-picker`}
          name={`${id}-date-picker`}
          placeholder={placeHolderText}
          type="text"
        />
      </div>
    </FormGroup>
  );
};

DateSelector.displayName = 'DateSelector';
