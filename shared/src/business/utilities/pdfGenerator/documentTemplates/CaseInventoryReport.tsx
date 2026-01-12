import { PrimaryHeader } from '@shared/business/utilities/pdfGenerator/components/PrimaryHeader';
import { ReportsHeader } from '@shared/business/utilities/pdfGenerator/components/ReportsHeader';
import React from 'react';
import classNames from 'classnames';

export type CaseInventoryReportFormattedCase = {
  isLeadCase: boolean;
  inConsolidatedGroup: boolean;
  docketNumber: string;
  caseTitle: string;
  docketNumberSuffix?: string | null;
  status: string;
  associatedJudge?: string;
};

export type CaseInventoryReportParams = {
  formattedCases: CaseInventoryReportFormattedCase[];
  reportTitle: string;
  showJudgeColumn: boolean;
  showStatusColumn: boolean;
};

export const CaseInventoryReport = ({
  formattedCases,
  reportTitle,
  showJudgeColumn,
  showStatusColumn,
}: CaseInventoryReportParams) => {
  return (
    <div>
      <PrimaryHeader />
      <ReportsHeader subtitle={reportTitle} title="Case Inventory Report" />

      <table>
        <thead>
          <tr>
            <th />
            <th>Docket No.</th>
            <th>Case Title</th>
            {showStatusColumn && <th className="status-header">Case Status</th>}
            {showJudgeColumn && <th className="judge-header">Judge</th>}
          </tr>
        </thead>
        <tbody>
          {formattedCases.map((formattedCase, idx) => (
            <tr key={idx}>
              <td>
                <div
                  className={classNames(
                    `${formattedCase.isLeadCase && 'lead-consolidated-icon'} ${
                      formattedCase.inConsolidatedGroup && 'consolidated-icon'
                    }`,
                    'inline-consolidated-icon',
                  )}
                />
              </td>
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
