import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import classNames from 'classnames';

export const Button = props => {
  const { href } = props;
  const {
    children,
    className,
    icon,
    link,
    secondary,
    ...remainingProps
  } = props;

  let { marginDirection } = props;
  marginDirection = marginDirection || 'right';

  const Element = href ? 'a' : 'button';

  const classes = classNames(
    className,
    `usa-button margin-${marginDirection}-205`,
    icon && 'no-wrap',
    secondary && 'usa-button--outline',
    link && 'usa-button--unstyled ustc-button--unstyled',
  );

  return (
    <Element className={classes} {...remainingProps}>
      {icon && (
        <FontAwesomeIcon className="margin-right-05" icon={icon} size="1x" />
      )}
      {children}
    </Element>
  );
};
