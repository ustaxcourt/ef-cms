import React from 'react';

export const BigHeader = function BigHeader({
  className,
  text,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className="big-blue-header">
      <div className="grid-container">
        <h1
          className={className || undefined}
          data-testid="header-text"
          tabIndex={-1}
        >
          {text}
        </h1>
      </div>
    </div>
  );
};

BigHeader.displayName = 'BigHeader';
