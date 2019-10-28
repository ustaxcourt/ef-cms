import { connect } from '@cerebral/react';
import React from 'react';
import classNames from 'classnames';

export const FormGroup = connect(props => {
  const { children, className, errorText } = props;

  return (
    <div
      className={classNames(
        'usa-form-group',
        errorText && 'usa-form-group--error',
        className,
      )}
    >
      {children}
      {errorText && <span className="usa-error-message">{errorText}</span>}
    </div>
  );
});
