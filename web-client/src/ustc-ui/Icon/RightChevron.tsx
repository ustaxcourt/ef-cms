import React from 'react';
import classNames from 'classnames';

export function RightChevron({
  className,
  ...props
}: { className?: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      aria-hidden="true"
      className={classNames('usa-icon', className)}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.29 6.71a1 1 0 0 0 0 1.41L13.17 12l-3.88 3.88a1 1 0 0 0 1.41 1.41l4.58-4.59a1 1 0 0 0 0-1.41l-4.58-4.59a1 1 0 0 0-1.41 0z"></path>
    </svg>
  );
}
