const React = require('react');

export const ReportsHeader = ({ subtitle, title }) => {
  return (
    <>
      <div id="reports-header">
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
      </div>
    </>
  );
};
