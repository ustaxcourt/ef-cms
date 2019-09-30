import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export const ButtonLink = props => {
  const { href } = props;
  const {
    children,
    className,
    icon,
    link,
    secondary,
    ...remainingProps
  } = props;

  const Element = (href && 'a') || 'button';

  const classes = classNames(
    'usa-button margin-right-205 margin-bottom-205',
    secondary && 'usa-button--outline',
    link && 'usa-button--unstyled ustc-button--unstyled',
    className,
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

ButtonLink.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.string,
  link: PropTypes.bool,
  secondary: PropTypes.bool,
};
