import React from 'react';

export const BigHeader = function BigHeader({
  className,
  text,
  button,
}: {
  text: string;
  className?: string;
  button?: React.ReactNode;
}) {
  return (
    <div className="big-blue-header">
      <div className="grid-container">
        {button ? (
          <div className="display-flex flex-align-center justify-between">
            <h1
              className={className || undefined}
              data-testid="header-text"
              tabIndex={-1}
            >
              {text}
            </h1>
            <div className="mobile-header-button">{button}</div>
          </div>
        ) : (
          <h1
            className={className || undefined}
            data-testid="header-text"
            tabIndex={-1}
          >
            {text}
          </h1>
        )}
      </div>
    </div>
  );
};

BigHeader.displayName = 'BigHeader';
