import React from 'react';

export const ProgressBar = props => {
  const { id, value } = props;
  const optionalProps = {
    'aria-label': props['aria-label'],
    'aria-labelledby': props['aria-labelledby'],
    id,
  };

  return (
    <progress
      className="focusable usa-sr-only"
      max="100"
      tabIndex={-1}
      value={value}
      {...optionalProps}
    >
      {value}% Complete
    </progress>
  );
};

ProgressBar.displayName = 'ProgressBar';
