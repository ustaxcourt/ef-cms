import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import classNames from 'classnames';

export const Button = props => {
  const { href } = props;
  const {
    children,
    className,
    icon,
    iconColor, // e.g. blue
    iconRight = false,
    iconSize = '1x',
    link,
    marginDirection = 'right',
    overrideMargin = false,
    secondary,
    ...remainingProps
  } = props;

  const Element = href ? 'a' : 'button';

  const classes = classNames(
    className,
    'usa-button',
    !overrideMargin && `margin-${marginDirection}-205`,
    overrideMargin,
    icon && 'no-wrap',
    secondary && 'usa-button--outline',
    link && 'usa-button--unstyled ustc-button--unstyled',
  );

  const iconClasses = classNames(
    iconRight ? 'margin-left-05' : 'margin-right-05',
    iconColor && `fa-icon-${iconColor}`,
  );

  return (
    <Element className={classes} {...remainingProps}>
      {icon && !iconRight && (
        <FontAwesomeIcon className={iconClasses} icon={icon} size={iconSize} />
      )}
      {children}
      {icon && iconRight && (
        <FontAwesomeIcon className={iconClasses} icon={icon} size={iconSize} />
      )}
    </Element>
  );
};
