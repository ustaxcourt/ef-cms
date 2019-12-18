import { connect } from '@cerebral/react';
import React from 'react';
import classNames from 'classnames';

export const CaseLink = connect(props => {
  const { children, className, docketNumber, formattedCase, onlyText } = props;

  const docketNumberString =
    docketNumber || (formattedCase && formattedCase.docketNumber);
  const docketNumberWithSuffixString =
    formattedCase && formattedCase.docketNumberWithSuffix;

  if (onlyText) {
    return (
      <span>
        {children || docketNumberWithSuffixString || docketNumberString}
      </span>
    );
  }

  return (
    <a
      className={classNames('no-wrap', className)}
      href={`/case-detail/${docketNumberString}`}
    >
      {children || docketNumberWithSuffixString || docketNumberString}
    </a>
  );
});
