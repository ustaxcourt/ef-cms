import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import React from 'react';

export const RequirementsText = ({
  fieldName,
  text,
  valid,
}: {
  fieldName: string;
  text?: string;
  valid?: boolean;
}) => {
  const className = valid ? 'valid-requirement' : 'invalid-requirement';
  return (
    <div
      aria-label={`${fieldName} validation errors`}
      className={`requirement-text ${className}`}
      data-testid={`${fieldName}-requirement-text`}
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
