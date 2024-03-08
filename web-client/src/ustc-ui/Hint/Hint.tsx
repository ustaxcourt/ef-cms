import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import classNames from 'classnames';

export const Hint = ({
  children,
  className,
  fullWidth,
  wider,
}: {
  children?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  wider?: boolean;
}) => {
  return (
    <div
      className={classNames(
        'alert-info add-bottom-margin',
        fullWidth && 'full-width',
        wider && 'wider',
        className,
      )}
    >
      <span className="usa-hint ustc-form-hint-with-svg">
        <FontAwesomeIcon
          className="fa-icon-blue-vivid"
          icon="info-circle"
          size="lg"
        />
        {children}
      </span>
    </div>
  );
};

Hint.displayName = 'Hint';
