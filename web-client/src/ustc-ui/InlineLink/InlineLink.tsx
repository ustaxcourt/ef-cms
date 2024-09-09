import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import classNames from 'classnames';

export const InlineLink = ({
  children,
  className = '',
  href,
  icon,
  iconSize = '1x',
  tooltip,
}: {
  children: string | React.ReactNode;
  className?: string;
  icon?: IconProp;
  href: string;
  iconSize?: '1x' | '2x' | '3x' | '4x' | '5x';
  tooltip?: string;
}) => {
  const classes = classNames(
    'usa-link--external no-wrap',
    className,
    tooltip && 'usa-tooltip',
    // icon && !shouldWrapText && 'no-wrap',
  );

  return (
    <a
      className={classes}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      title={tooltip}
    >
      {icon && (
        <FontAwesomeIcon className="fa-icon-blue" icon={icon} size={iconSize} />
      )}
      {children}
    </a>
  );
};
