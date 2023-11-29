import React from 'react';
import classNames from 'classnames';

export const CaseLink = ({
  children,
  className,
  formattedCase,
  onlyText,
  rel,
  target,
}: {
  className?: string;
  formattedCase: { docketNumber: string; docketNumberWithSuffix?: string };
  onlyText?: boolean;
  children?: string | React.ReactNode;
  rel?: string;
  target?: string;
}) => {
  return onlyText ? (
    <span className={classNames('no-wrap', className)}>
      {children ||
        formattedCase.docketNumberWithSuffix ||
        formattedCase.docketNumber}
    </span>
  ) : (
    <a
      className={classNames('no-wrap', className)}
      href={`/case-detail/${formattedCase.docketNumber}`}
      rel={rel}
      target={target}
    >
      {children ||
        formattedCase.docketNumberWithSuffix ||
        formattedCase.docketNumber}
    </a>
  );
};

CaseLink.displayName = 'CaseLink';
