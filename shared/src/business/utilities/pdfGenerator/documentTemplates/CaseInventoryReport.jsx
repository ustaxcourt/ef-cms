const React = require('react');

const { ReportsHeader } = require('../components/ReportsHeader.jsx');

export const CaseInventoryReport = ({
  formattedCases,
  reportTitle,
  showJudgeColumn,
  showStatusColumn,
}) => {
  return (
    <div className="page-container">
      <ReportsHeader subtitle={reportTitle} title="Case Inventory Report" />

      <table>
        <thead>
          <tr>
            <th>Docket</th>
            <th>Case title</th>
            {showStatusColumn && <th>Case Status</th>}
            {showJudgeColumn && <th>Judge</th>}
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
              {showStatusColumn && <td>{formattedCase.status}</td>}
              {showJudgeColumn && <td>{formattedCase.associatedJudge}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
