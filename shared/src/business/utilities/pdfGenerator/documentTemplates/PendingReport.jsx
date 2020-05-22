const React = require('react');

const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');
const { ReportsHeader } = require('../components/ReportsHeader.jsx');

export const PendingReport = ({ pendingItems, subtitle }) => {
  return (
    <>
      <PrimaryHeader />
      <ReportsHeader subtitle={subtitle} title="Pending Report" />
      <table>
        <thead>
          <tr>
            <th>Docket</th>
            <th>Date Filed</th>
            <th>Case name</th>
            <th>Filings and proceedings</th>
            <th>Case status</th>
            <th>Judge</th>
          </tr>
        </thead>
        <tbody>
          {pendingItems &&
            pendingItems.map(pendingItem => {
              return (
                <tr key={pendingItem.docketNumberWithSuffix}>
                  <td>{pendingItem.docketNumberWithSuffix}</td>
                  <td>{pendingItem.formattedFiledDate}</td>
                  <td>{pendingItem.caseTitle}</td>
                  <td>{pendingItem.formattedName}</td>
                  <td>{pendingItem.status}</td>
                  <td>{pendingItem.associatedJudgeFormatted}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};
