import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CaseStatusHistory = connect(
  {
    caseStatusHistoryHelper: state.caseStatusHistoryHelper,
  },
  function CaseStatusHistory({ caseStatusHistoryHelper }) {
    return (
      <div className="grid-row grid-gap flex-justify">
        <div className="grid-col-12">
          <div className="grid-row">
            <div className="grid-col-6">
              <h4>Case Status</h4>
            </div>
            <div className="grid-col-6 text-right margin-top-1">
              <span className="text-semibold">
                Count:{' '}
                {caseStatusHistoryHelper.formattedCaseStatusHistory.length}
              </span>
            </div>
          </div>

          <table className="usa-table ustc-table responsive-table case-status-history">
            <thead>
              <tr>
                <th>Date Changed</th>
                <th>Case Status</th>
                <th>Changed By</th>
              </tr>
            </thead>
            <tbody>
              {caseStatusHistoryHelper.formattedCaseStatusHistory.map(
                (history, idx) => (
                  <tr key={idx}>
                    <td className="date-changed">
                      {history.formattedDateChanged}
                    </td>
                    <td>{history.updatedCaseStatus}</td>
                    <td>{history.changedBy}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          {!caseStatusHistoryHelper.isTableDisplayed && (
            <div>There is no case status history.</div>
          )}
        </div>
      </div>
    );
  },
);

CaseStatusHistory.displayName = 'CaseStatusHistory';
