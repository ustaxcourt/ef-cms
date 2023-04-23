import { PrimaryHeader } from '../components/PrimaryHeader.tsx';
import { ReportsHeader } from '../components/ReportsHeader.tsx';
import React from 'react';

export const PendingReport = ({ pendingItems, subtitle }) => {
  return (
    <>
      <PrimaryHeader />
      <ReportsHeader subtitle={subtitle} title="Pending Report" />
      <table>
        <thead>
          <tr>
            <th>Docket No.</th>
            <th>Date Filed</th>
            <th>Case Name</th>
            <th>Filings and Proceedings</th>
            <th>Case Status</th>
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
