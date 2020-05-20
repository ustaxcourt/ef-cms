const React = require('react');

const ReportsHeader = ({ subtitle, title }) => {
  return (
    <>
      <div id="reports-header">
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
      </div>
    </>
  );
};

export default ReportsHeader;
