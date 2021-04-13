import { Focus } from '../Focus/Focus';
import React from 'react';

export const ProgressBar = props => {
  const { id, value } = props;
  const optionalProps = {
    'aria-labelledby': props['aria-labelledby'],
    id,
  };

  return (
    <Focus className="usa-sr-only">
      <progress
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={value}
        max="100"
        role="progressbar"
        tabIndex="-1"
        value={value}
        {...optionalProps}
      >
        {value}%
      </progress>
    </Focus>
  );
};
