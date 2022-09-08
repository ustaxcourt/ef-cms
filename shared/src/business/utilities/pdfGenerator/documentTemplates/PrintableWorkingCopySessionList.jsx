const React = require('react');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');
const { ReportsHeader } = require('../components/ReportsHeader.jsx');

export const PrintableWorkingCopySessionList = ({ term }) => {
  return (
    <>
      <PrimaryHeader />
      <ReportsHeader subtitle={term} title="Trial Session Planning Report" />
      <h1>I AM WORKING!!!</h1>
    </>
  );
};
