import React from 'react';

export const PreformattedText = ({
  className,
  text,
}: {
  text?: string;
  className?: string;
}) => {
  if (!text) {
    return;
  }

  return (
    <pre className={`preformatted-text${className ? ` ${className}` : ''}`}>
      {text}
    </pre>
  );
};

PreformattedText.displayName = 'PreformattedText';
