const React = require('react');

const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');
const { ReportsHeader } = require('../components/ReportsHeader.jsx');

const getTermHeaders = (session, index) => {
  return (
    <th key={index}>
      {session.name} {session.year}
    </th>
  );
};

export const TrialSessionPlanningReport = ({ sessions, term, terms }) => {
  return (
    <>
      <PrimaryHeader />
      <ReportsHeader subtitle={term} title="Trial Session Planning Report" />

      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Location</th>
            <th>All</th>
            <th>Small</th>
            <th>Regular</th>
            <th>State</th>
            {terms.map(getTermHeaders)}
          </tr>
        </thead>
        <tbody>
          {sessions &&
            sessions.map(sessionDetail => {
              console.log(sessionDetail);
            })}
        </tbody>
      </table>
    </>
  );
};
