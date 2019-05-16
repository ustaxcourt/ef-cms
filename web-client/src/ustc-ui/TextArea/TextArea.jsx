import { connect } from '@cerebral/react';
import React from 'react';

export const TextArea = connect(props => {
  const { id, name, label, onChange, error } = props;
  const ariaLabelledby = props['aria-labelledby'];

  return (
    <div className={'usa-form-group ' + (error ? 'usa-form-group--error' : '')}>
      <label htmlFor={id} className="usa-label">
        {label}
      </label>
      <textarea
        className={'usa-textarea ' + (error ? 'usa-textarea--error' : '')}
        id={id}
        name={name}
        onChange={onChange}
        aria-labelledby={ariaLabelledby}
      />
      <div className="usa-error-message beneath">{error}</div>
    </div>
  );
});
