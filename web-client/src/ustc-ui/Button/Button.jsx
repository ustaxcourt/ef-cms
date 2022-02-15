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
    isActive = false,
    link,
    marginDirection = 'right',
    overrideMargin = false,
    secondary,
    shouldWrapText = false,
    ...remainingProps
  } = props;

  const isLink = Boolean(href);
  const Element = isLink ? 'a' : 'button';
  if (isActive && !isLink && remainingProps['aria-pressed'] === undefined) {
    remainingProps['aria-pressed'] = true;
  }

  const classes = classNames(
    className,
    'usa-button',
    !overrideMargin && `margin-${marginDirection}-205`,
    overrideMargin,
    icon && !shouldWrapText && 'no-wrap',
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
