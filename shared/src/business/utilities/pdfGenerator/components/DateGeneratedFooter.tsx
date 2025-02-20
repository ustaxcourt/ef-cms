import React from 'react';

export const DateGeneratedFooter = ({
  dateGenerated,
}: {
  dateGenerated: string;
}) => {
  return (
    <div
      className="date-printed-footer"
      style={{
        fontSize: '10px',
        textAlign: 'center',
      }}
    >
      Generated {dateGenerated}
    </div>
  );
};
