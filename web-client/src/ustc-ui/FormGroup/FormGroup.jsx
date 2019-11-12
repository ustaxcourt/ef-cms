import { connect } from '@cerebral/react';
import React from 'react';
import classNames from 'classnames';

export const FormGroup = connect(props => {
  const { children, className, errorText, id } = props;

  let hasError = false;

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

  return (
    <div
      className={classNames(
        'usa-form-group',
        hasError && 'usa-form-group--error',
        className,
      )}
      id={id}
    >
      {children}
      {Array.isArray(errorText) && renderMultipleErrors()}
      {!Array.isArray(errorText) && renderSingleError()}
    </div>
  );
});
