import { connect } from '@cerebral/react';
import React from 'react';
import classNames from 'classnames';

export const FormGroup = connect(function FormGroup(props) {
  const { children, className, confirmationText, errorText, formGroupRef, id } =
    props;

  let hasError = false;
  let hasConfirmation = !!confirmationText;

  if (Array.isArray(errorText)) {
    hasError = errorText.some(text => !!text);
  } else {
    hasError = !!errorText;
  }

  const renderMultipleErrors = () => {
    return errorText.map(text => {
      return (
        text && (
          <span className="usa-error-message" key={text}>
            {text}
          </span>
        )
      );
    });
  };

  const renderSingleError = () => {
    return errorText && <span className="usa-error-message">{errorText}</span>;
  };
  const renderSingleConfirmation = () => {
    return (
      confirmationText && (
        <span className="text-confirmation-message">{confirmationText}</span>
      )
    );
  };

  return (
    <div
      className={classNames(
        'usa-form-group',
        hasError && 'usa-form-group--error',
        hasConfirmation && 'form-group-confirmation',
        className,
      )}
      id={id}
      ref={formGroupRef}
    >
      {children}
      {hasConfirmation && renderSingleConfirmation()}
      {Array.isArray(errorText) && renderMultipleErrors()}
      {!Array.isArray(errorText) && renderSingleError()}
    </div>
  );
});

FormGroup.displayName = 'FormGroup';
