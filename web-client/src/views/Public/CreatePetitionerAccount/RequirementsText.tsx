import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import React from 'react';

export const RequirementsText = ({ fieldName, text, valid }) => {
  const className = valid ? 'valid-requirement' : 'invalid-requirement';
  return (
    <div
      aria-label={`${fieldName} validation errors`}
      className={`requirement-text ${className}`}
    >
      <Icon
        className=""
        icon={valid ? 'check-circle' : 'times-circle'}
        size="1x"
      />{' '}
      {text}
    </div>
  );
};
