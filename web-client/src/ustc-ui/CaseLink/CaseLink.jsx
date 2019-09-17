import { connect } from '@cerebral/react';
import React from 'react';
import classNames from 'classnames';

export const CaseLink = connect(props => {
  const { children, className, formattedCase } = props;

  return (
    <a
      className={classNames('no-wrap', className)}
      href={`/case-detail/${formattedCase.docketNumber}`}
    >
      {children || formattedCase.docketNumberWithSuffix}
    </a>
  );
});
