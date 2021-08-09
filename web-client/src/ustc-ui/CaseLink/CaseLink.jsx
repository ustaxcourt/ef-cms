import { connect } from '@cerebral/react';
import React from 'react';
import classNames from 'classnames';

export const CaseLink = connect(function CaseLink(props) {
  const {
    children,
    className,
    docketNumber,
    formattedCase,
    onlyText,
    openInNewTab,
  } = props;

  let relVal = '';
  let targetVal = '';

  if (openInNewTab) {
    relVal = 'noreferrer';
    targetVal = '_blank';
  }

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
      rel={relVal}
      target={targetVal}
    >
      {children || docketNumberWithSuffixString || docketNumberString}
    </a>
  );
});
