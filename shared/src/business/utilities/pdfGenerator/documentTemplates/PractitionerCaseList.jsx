const React = require('react');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');

export const PractitionerCaseList = ({
  barNumber,
  closedCases,
  openCases,
  practitionerName,
}) => {
  return (
    <>
      <PrimaryHeader />
      <div id="case-list-header">
        <h2 className="margin-bottom-0">{practitionerName}</h2>
        <p className="margin-top-0 text-center text-size-small">{barNumber}</p>
      </div>

      <h3
        className="text-align-left text-no-underline margin-bottom-5"
        id="open-cases-count"
      >
        Open Cases ({openCases.length})
      </h3>
      {openCases.length > 0 && (
        <table id="open-cases">
          <thead>
            <tr>
              <th className="width-100">Docket No.</th>
              <th>Case Title</th>
              <th className="width-250">Case Status</th>
            </tr>
          </thead>
          <tbody>
            {openCases.map(openCase => {
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
      )}

      <h3
        className="text-align-left text-no-underline margin-bottom-5"
        id="closed-cases-count"
      >
        Closed Cases ({closedCases.length})
      </h3>
      {closedCases.length > 0 && (
        <table id="closed-cases">
          <thead>
            <tr>
              <th className="width-100">Docket No.</th>
              <th>Case Title</th>
            </tr>
          </thead>
          <tbody>
            {closedCases.map(closedCase => {
              return (
                <tr key={closedCase.caseTitle}>
                  <td>{closedCase.docketNumberWithSuffix}</td>
                  <td>{closedCase.caseTitle}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
};
