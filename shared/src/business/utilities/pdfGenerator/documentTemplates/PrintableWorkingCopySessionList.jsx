const React = require('react');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');
const { ReportsHeader } = require('../components/ReportsHeader.jsx');

export const PrintableWorkingCopySessionList = ({ subtitle, trialSession }) => {
  return (
    <>
      <PrimaryHeader />
      <ReportsHeader
        subtitle={subtitle}
        title="Trial Session Planning Report"
      />
      <h1>I AM WORKING!!!</h1>
      <h2>{trialSession.trialSessionId}</h2>
    </>
  );
};
