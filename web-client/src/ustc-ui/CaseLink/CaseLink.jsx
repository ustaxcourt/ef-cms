import React from 'react';
import classNames from 'classnames';

export const CaseLink = props => {
  const {
    children,
    className,
    docketNumber,
    formattedCase,
    onlyText,
    ...remainingProps
  } = props;

  const docketNumberString =
    docketNumber || (formattedCase && formattedCase.docketNumber);
  const docketNumberWithSuffixString =
    formattedCase && formattedCase.docketNumberWithSuffix;

  if (onlyText) {
    return (
      <span className={classNames('no-wrap', className)}>
        {children || docketNumberWithSuffixString || docketNumberString}
      </span>
    );
  }

  return (
    <a
      className={classNames('no-wrap', className)}
      href={`/case-detail/${docketNumberString}`}
      {...remainingProps}
    >
      {children || docketNumberWithSuffixString || docketNumberString}
    </a>
  );
};
