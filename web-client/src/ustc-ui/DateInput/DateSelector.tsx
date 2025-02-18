import {
  FORMATS,
  createISODateString,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import React, { useEffect, useRef } from 'react';
import datePicker from '../../../../node_modules/@uswds/uswds/packages/usa-date-picker/src';

export const DateSelector = ({
  defaultValue,
  disabled = false,
  displayOptionalHintText = false,
  errorText,
  formatDateOnChange = false,
  formGroupClassNames,
  hintText = undefined,
  id,
  label,
  labelPosition = 'top',
  maxDate,
  minDate,
  onBlur,
  onChange,
  placeHolderText,
  showDateHint = false,
}: {
  defaultValue: string | undefined; // expects format 'YYYY-MM-DD'
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
  labelPosition?: 'top' | 'left';
  formatDateOnChange?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showDateHint?: boolean;
}) => {
  const datePickerId = `#${id}-picker.usa-date-picker__external-input`;
  const formGroupInputRef = useRef<HTMLDivElement>(null);
  const defaultMinDate = '0000-01-01';
  formGroupClassNames =
    labelPosition === 'left'
      ? `${formGroupClassNames} display-flex align-items-center`
      : `${formGroupClassNames}`;
  const labelClassNames =
    labelPosition === 'left'
      ? 'margin-right-2 margin-bottom-0 display-inline-block'
      : label
        ? 'usa-label'
        : '';
  const pickerClassNames =
    labelPosition === 'left'
      ? 'usa-date-picker display-inline-block left-labeled'
      : 'usa-date-picker';

  useEffect(() => {
    if (formGroupInputRef.current) {
      datePicker.on(formGroupInputRef.current);
      const myDatePicker =
        formGroupInputRef.current.querySelector(datePickerId);

      if (!myDatePicker) throw new Error('could not find expected date picker');

      let onChangeHandler = onChange;
      if (formatDateOnChange) {
        onChangeHandler = originalEvent => {
          // Create a new event to avoid modifying the original
          const newEvent = new Event('change', {
            bubbles: true,
          }) as unknown as React.ChangeEvent<HTMLInputElement>;
          const target = Object.create(originalEvent.target, {
            value: {
              get: () => {
                if (originalEvent.target.value === '') return '';
                return formatDateString(
                  createISODateString(
                    originalEvent.target.value,
                    FORMATS.MMDDYYYY,
                  ),
                  FORMATS.YYYYMMDD,
                );
              },
            },
          });

          Object.defineProperty(newEvent, 'target', {
            enumerable: true,
            value: target,
          });

          // Original input keeps MM/DD/YYYY format
          onChange(newEvent);
        };
      }

      (myDatePicker as HTMLInputElement).addEventListener(
        'change',
        onChangeHandler,
      );
      (myDatePicker as HTMLInputElement).addEventListener(
        'input',
        onChangeHandler,
      );
      if (onBlur)
        (myDatePicker as HTMLInputElement).addEventListener('blur', onBlur);
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
      ref={formGroupInputRef}
    >
      <label
        className={labelClassNames}
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
        className={pickerClassNames}
        data-default-value={defaultValue}
        data-max-date={maxDate}
        data-min-date={minDate ?? defaultMinDate}
      >
        <input
          aria-describedby={`date-picker-label ${id}-date-hint`}
          aria-label={`${id}-picker`}
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
