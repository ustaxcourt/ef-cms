import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export const ButtonLink = props => {
  const { className, ...remainingProps } = props;
  const classes = classNames(
    'usa-button usa-button--unstyled ustc-button--unstyled',
    className,
  );

  return <button className={classes} {...remainingProps}></button>;
};

ButtonLink.propTypes = {
  className: PropTypes.string,
};
