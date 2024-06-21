import React from 'react';
import classNames from 'classnames';

export const FormGroup = ({
  children,
  className,
  confirmationText,
  errorMessageId,
  errorText,
  formGroupRef,
  id,
  omitFormGroupClass,
}: {
  children: React.ReactNode;
  className?: string;
  confirmationText?: string;
  errorText?: string | string[];
  errorMessageId?: string;
  formGroupRef?: React.RefObject<HTMLInputElement>;
  id?: string;
  omitFormGroupClass?: boolean;
}) => {
  let hasError = false;
  let hasConfirmation = !!confirmationText;

  if (Array.isArray(errorText)) {
    hasError = errorText.some(text => !!text);
  } else {
    hasError = !!errorText;
  }

  const renderMultipleErrors = (errorTextArr: string[]) => {
    return errorTextArr.map((text: string, index: number) => {
      return (
        text && (
          <span
            className="usa-error-message"
            data-testid={`${errorMessageId}-${index}`}
            key={text}
          >
            {text}
          </span>
        )
      );
    });
  };

  const renderSingleError = () => {
    return (
      errorText && (
        <span className="usa-error-message" data-testid={errorMessageId}>
          {errorText}
        </span>
      )
    );
  };
  const renderSingleConfirmation = () => {
    return (
      confirmationText && (
        <span className="ustc-confirmation-message">{confirmationText}</span>
      )
    );
  };

  return (
    <div
      className={classNames(
        !omitFormGroupClass && 'usa-form-group',
        hasConfirmation && 'ustc-form-group--confirmation',
        hasError && 'usa-form-group--error',
        className,
      )}
      id={id}
      ref={formGroupRef}
    >
      {children}
      {Array.isArray(errorText) && renderMultipleErrors(errorText)}
      {!Array.isArray(errorText) && renderSingleError()}
      {hasConfirmation && renderSingleConfirmation()}
    </div>
  );
};

FormGroup.displayName = 'FormGroup';
