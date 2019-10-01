import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
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
    type,
    ...remainingProps
  } = props;

  remainingProps.type = type || 'button';

  const Element = (href && 'a') || 'button';

  const classes = classNames(
    className,
    'usa-button margin-right-205',
    secondary && 'usa-button--outline',
    link && 'usa-button--unstyled ustc-button--unstyled',
  );

  return (
    <Element className={classes} type="button" {...remainingProps}>
      {icon && (
        <FontAwesomeIcon className="margin-right-05" icon={icon} size="1x" />
      )}
      {children}
    </Element>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.string,
  link: PropTypes.bool,
  secondary: PropTypes.bool,
  type: PropTypes.string,
};
