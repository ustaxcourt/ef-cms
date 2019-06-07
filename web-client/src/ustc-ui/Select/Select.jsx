import { connect } from '@cerebral/react';
import React from 'react';

export const Select = connect(props => {
  const {
    id,
    disabled,
    keys,
    name,
    label,
    onChange,
    values,
    error,
    formatter,
  } = props;
  const ariaDisabled = props['aria-disabled'];

  return (
    <div className={'usa-form-group ' + (error ? 'usa-form-group--error' : '')}>
      <label htmlFor={id} className="usa-label">
        {label}
      </label>
      <select
        className={'usa-select ' + (error ? 'usa-select--error' : '')}
        id={id}
        name={name}
        onChange={onChange}
        disabled={disabled}
        aria-disabled={ariaDisabled}
      >
        <option value="">- Select -</option>
        {values.map(value => (
          <option key={keys(value)} value={keys(value)}>
            {formatter(value)}
          </option>
        ))}
      </select>
      {error && <div className="usa-error-message beneath">{error}</div>}
    </div>
  );
});
