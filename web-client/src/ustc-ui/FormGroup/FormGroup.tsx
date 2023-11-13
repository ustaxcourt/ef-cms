import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';
import classNames from 'classnames';

export const FormGroup = connect(function FormGroup(props) {
  const {
    children,
    className,
    confirmationText,
    errorText,
    formGroupRef,
    id,
    omitFormGroupClass,
  } = props;

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
      {Array.isArray(errorText) && renderMultipleErrors()}
      {!Array.isArray(errorText) && renderSingleError()}
      {hasConfirmation && renderSingleConfirmation()}
    </div>
  );
});

FormGroup.displayName = 'FormGroup';
