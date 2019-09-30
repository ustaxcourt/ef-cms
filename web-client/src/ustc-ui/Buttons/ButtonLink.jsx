import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export const ButtonLink = props => {
  const { className, ...remainingProps } = props;
  const classes = classNames(
    'usa-button usa-button--unstyled ustc-button--unstyled bg-orange',
    className,
  );

  return (
    <button className={classes} type="button" {...remainingProps}></button>
  );
};

ButtonLink.propTypes = {
  className: PropTypes.string,
};
