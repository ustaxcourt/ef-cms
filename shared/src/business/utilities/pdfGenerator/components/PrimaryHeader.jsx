const React = require('react');

export const PrimaryHeader = ({ h2 }) => {
  return (
    <>
      <div className="court-header">
        <div className="us-tax-court-seal"></div>
        <h1>United States Tax Court</h1>
        <div className="court-address">Washington, DC 21207</div>
        {h2 && <h2>{h2}</h2>}
        <div className="clear"></div>
      </div>
    </>
  );
};
