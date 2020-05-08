const React = require('react');

export const ReportsHeader = ({ subtitle, title }) => {
  return (
    <>
      <div id="reports-header">
        <div className="us-tax-court-seal"></div>
        <h1>United States Tax Court</h1>
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
      </div>
    </>
  );
};
