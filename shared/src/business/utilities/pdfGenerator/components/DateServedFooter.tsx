import React from 'react';

export const DateServedFooter = ({ dateServed }) => {
  return (
    <div
      className="date-served-footer"
      style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginTop: '25px',
        textAlign: 'center',
        width: '100%',
      }}
    >
      SERVED {dateServed}
    </div>
  );
};
