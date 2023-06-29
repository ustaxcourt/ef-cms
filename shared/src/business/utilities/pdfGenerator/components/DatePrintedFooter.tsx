import React from 'react';

export const DatePrintedFooter = ({ datePrinted }) => {
  return (
    <div
      className="date-printed-footer"
      style={{
        fontSize: '10px',
        textAlign: 'center',
      }}
    >
      Printed {datePrinted}
    </div>
  );
};
