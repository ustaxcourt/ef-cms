import { PublicMobileTrialSessionsDataRow } from '@web-client/views/Public/TrialSessions/PublicMobileTrialSessionsDataRow';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

type PublicMobileTrialSessionsTableProps = {};

const PublicMobileTrialSessionsTableDeps = {
  publicTrialSessionsHelper: state.publicTrialSessionsHelper,
};

export const PublicMobileTrialSessionsTable = connect<
  PublicMobileTrialSessionsTableProps,
  typeof PublicMobileTrialSessionsTableDeps
>(PublicMobileTrialSessionsTableDeps, function ({ publicTrialSessionsHelper }) {
  const { mobileFilteredGroups, publicTrialSessionCount } =
    publicTrialSessionsHelper;

  return (
    <>
      <div className="grid-row margin-bottom-2 width-full flex-align-center"></div>
      <div className="width-full text-right">
        <span className="text-bold">Count:</span>{' '}
        <span className="text-semibold">{publicTrialSessionCount}</span>
      </div>
      {publicTrialSessionCount === 0 && (
        <p>There are no trial sessions for the selected filters.</p>
      )}
      <div className="padding-1"></div>

      <table className="usa-table usa-table--stacked-header usa-table--borderless">
        <thead>
          <tr>
            <th scope="col">Document title</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {mobileFilteredGroups.map(group => {
            return (
              <tr className="padding-0" key={group.header.sessionWeekStartDate}>
                <th data-label="Document title" scope="row">
                  Week of {group.header.formattedSessionWeekStartDate}
                </th>
                {group.rows.map((tsRow, index) => {
                  return (
                    <React.Fragment key={tsRow.trialSessionId}>
                      <td
                        className={
                          index !== group.rows.length - 1
                            ? 'double-border'
                            : undefined
                        }
                      >
                        <PublicMobileTrialSessionsDataRow
                          judgeName={tsRow.judge.name}
                          proceedingType={tsRow.proceedingType}
                          sessionType={tsRow.sessionType}
                          startDate={tsRow.formattedStartDate}
                          swingSession={tsRow.swingSession}
                          trialLocation={tsRow.trialLocation}
                          trialSessionId={tsRow.trialSessionId}
                        />
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
});
