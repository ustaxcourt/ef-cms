const React = require('react');
const { PrimaryHeader } = require('../components/PrimaryHeader');
const { ReportsHeader } = require('../components/ReportsHeader.jsx');

export const CaseInventoryReport = ({
  formattedCases,
  reportTitle,
  showJudgeColumn,
  showStatusColumn,
}) => {
  return (
    <div className="page-container">
      <PrimaryHeader />
      <ReportsHeader subtitle={reportTitle} title="Case Inventory Report" />

      <table>
        <thead>
          <tr>
            <th>Docket No.</th>
            <th>Case Title</th>
            {showStatusColumn && <th className="status-header">Case Status</th>}
            {showJudgeColumn && <th className="judge-header">Judge</th>}
          </tr>
        </thead>
        <tbody>
          {formattedCases.map((formattedCase, idx) => (
            <tr key={idx}>
              <td className="no-wrap">
                {formattedCase.docketNumber}
                {formattedCase.docketNumberSuffix}
              </td>
              <td>{formattedCase.caseTitle}</td>
              {showStatusColumn && (
                <td className="status-column">{formattedCase.status}</td>
              )}
              {showJudgeColumn && (
                <td className="judge-column">
                  {formattedCase.associatedJudge}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
