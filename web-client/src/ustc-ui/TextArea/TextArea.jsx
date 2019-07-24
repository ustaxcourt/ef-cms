import { connect } from '@cerebral/react';
import React from 'react';

export const TextArea = connect(props => {
  const { error, id, label, name, onChange } = props;
  const ariaLabelledby = props['aria-labelledby'];

  return (
    <div className={'usa-form-group ' + (error ? 'usa-form-group--error' : '')}>
      <label className="usa-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        aria-labelledby={ariaLabelledby}
        className={'usa-textarea ' + (error ? 'usa-textarea--error' : '')}
        id={id}
        name={name}
        onChange={onChange}
      />
      {error && <div className="usa-error-message beneath">{error}</div>}
    </div>
  );
});
