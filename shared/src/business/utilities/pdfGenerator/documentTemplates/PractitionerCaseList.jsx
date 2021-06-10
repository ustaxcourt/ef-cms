const React = require('react');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');
const { ReportsHeader } = require('../components/ReportsHeader.jsx');

export const PractitionerCaseList = ({
  barNumber,
  closedCases,
  openCases,
  practitionerName,
}) => {
  return (
    <>
      <PrimaryHeader />
      <ReportsHeader subtitle={barNumber} title={practitionerName} />

      <h3 id="open-cases-count">Open Cases ({openCases.length})</h3>
      <table id="open-cases">
        <thead>
          <tr>
            <th>Docket No.</th>
            <th>Case Title</th>
            <th>Case Status</th>
          </tr>
        </thead>
        <tbody>
          {openCases &&
            openCases.map(openCase => {
              return (
                <tr key={openCase.caseTitle}>
                  <td>{openCase.docketNumberWithSuffix}</td>
                  <td>{openCase.caseTitle}</td>
                  <td>{openCase.status}</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <h3 id="closed-cases-count">Closed Cases ({closedCases.length})</h3>
      <table id="closed-cases">
        <thead>
          <tr>
            <th>Docket No.</th>
            <th>Case Title</th>
            <th>Case Status</th>
          </tr>
        </thead>
        <tbody>
          {closedCases &&
            closedCases.map(closedCase => {
              return (
                <tr key={closedCase.caseTitle}>
                  <td>{closedCase.docketNumberWithSuffix}</td>
                  <td>{closedCase.caseTitle}</td>
                  <td>{closedCase.status}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};
