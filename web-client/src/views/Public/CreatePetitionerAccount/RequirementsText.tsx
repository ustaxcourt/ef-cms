import { Icon } from '@web-client/ustc-ui/Icon/Icon';
import React from 'react';

export const RequirementsText = ({ label, valid }) => {
  const className = valid ? 'valid-requirement' : 'invalid-requirement';
  return (
    <div className={className}>
      <Icon
        className=""
        icon={valid ? 'check-circle' : 'times-circle'}
        size="1x"
      />{' '}
      {label}
    </div>
  );
};
