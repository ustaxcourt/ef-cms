const React = require('react');

export const DatePrintedFooter = ({ datePrinted }) => {
  return (
    <div
      className="date-printed-footer"
      style={{
        'font-size': '10px',
        'text-align': 'center',
      }}
    >
      Printed {datePrinted}
    </div>
  );
};
