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
  labelPosition = 'top',
  maxDate,
  minDate,
  onBlur,
  onChange,
  placeHolderText,
  pristine = false,
  showDateHint = false,
  showDisabledDate = false,
}: {
  defaultValue: string | undefined; // expects format 'YYYY-MM-DD'
  displayOptionalHintText?: boolean;
  errorText?: string;
  maxDate?: string;
  disabled?: boolean;
  formGroupClassNames?: string;
  minDate?: string;
  hintText?: string;
  id: string;
  label?: string;
  labelPosition?: 'top' | 'left';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolderText?: string;
  pristine?: boolean;
  showDateHint?: boolean;
  showDisabledDate?: boolean;
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

  const getExternalDatePickerInput = (): HTMLInputElement => {
    const container = formGroupInputRef.current;
    const externalInput = container?.querySelector(datePickerId);

    if (!externalInput) throw new Error('could not find expected date picker');

    return externalInput as HTMLInputElement;
  };

  useEffect(() => {
    if (formGroupInputRef.current) {
      datePicker.on(formGroupInputRef.current);
      const myDatePicker = getExternalDatePickerInput();

      const transformDomEventIntoReactEvent = (
        e: Event,
      ): React.ChangeEvent<HTMLInputElement> => {
        const target = e.target as HTMLInputElement;
        return {
          target,
          currentTarget: target,
          bubbles: e.bubbles,
          cancelable: e.cancelable,
          defaultPrevented: e.defaultPrevented,
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation(),
          nativeEvent: e,
          isDefaultPrevented: () => e.defaultPrevented,
          isPropagationStopped: () => false,
          persist: () => {},
          type: e.type,
        } as unknown as React.ChangeEvent<HTMLInputElement>;
      };

      const onChangeHandler = (e: Event) =>
        onChange(transformDomEventIntoReactEvent(e));
      const onBlurHandler = onBlur
        ? (e: Event) => onBlur(transformDomEventIntoReactEvent(e))
        : null;

      myDatePicker.addEventListener('change', onChangeHandler);
      myDatePicker.addEventListener('input', onChangeHandler);

      if (onBlur && onBlurHandler)
        myDatePicker.addEventListener('blur', onBlurHandler);

      return () => {
        myDatePicker.removeEventListener('change', onChangeHandler);
        myDatePicker.removeEventListener('input', onChangeHandler);

        if (onBlur && onBlurHandler) {
          myDatePicker.removeEventListener('blur', onBlurHandler);
        }
      };
    }
  }, [formGroupInputRef]);

  useEffect(() => {
    const container = formGroupInputRef.current;
    if (!container) return;

    const picker = container.querySelector('.usa-date-picker');
    if (!picker) return;

    const myDatePicker = getExternalDatePickerInput();

    if ((disabled && !showDisabledDate) || pristine) {
      myDatePicker.value = '';
    }

    if (disabled) {
      datePicker.disable(picker);
      return;
    }

    datePicker.enable(picker);
  }, [datePickerId, disabled, pristine, showDisabledDate]);

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
