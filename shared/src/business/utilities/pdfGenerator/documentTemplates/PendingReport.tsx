import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';
import { PrimaryHeader } from '../components/PrimaryHeader';
import { ReportsHeader } from '../components/ReportsHeader';
import React from 'react';
import classNames from 'classnames';

export const PendingReport = ({
  pendingItems,
  subtitle,
}: {
  pendingItems: PendingItemFormatted[];
  subtitle: string;
}) => {
  return (
    <>
      <PrimaryHeader />
      <ReportsHeader subtitle={subtitle} title="Pending Report" />
      <div className="text-right margin-bottom-5">
        Count: {pendingItems.length}
      </div>
      <table>
        <thead>
          <tr>
            <th />
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
                  <td>
                    <div
                      className={classNames(
                        `${
                          pendingItem.isLeadCase && 'lead-consolidated-icon'
                        } ${
                          pendingItem.inConsolidatedGroup && 'consolidated-icon'
                        }`,
                        'inline-consolidated-icon',
                      )}
                    />
                  </td>
                  <td>{pendingItem.docketNumberWithSuffix}</td>
                  <td>{pendingItem.formattedFiledDate}</td>
                  <td>{pendingItem.caseTitle}</td>
                  <td>{pendingItem.formattedName}</td>
                  <td>{pendingItem.formattedStatus}</td>
                  <td>{pendingItem.associatedJudgeFormatted}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};
