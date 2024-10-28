import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { PublicMobileTrialSessionsDataRow } from '@web-client/views/Public/TrialsSessions/PublicMobileTrialSessionsDataRow';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

type PublicMobileTrialSessionsTableProps = {
  pageNumber: number;
  totalPages: number;
  ROOT: string;
};

const PublicMobileTrialSessionsTableDeps = {
  publicTrialSessionsHelper: state.publicTrialSessionsHelper,
  updateFormValueSequence: sequences.updateFormValueSequence,
};

export const PublicMobileTrialSessionsTable = connect<
  PublicMobileTrialSessionsTableProps,
  typeof PublicMobileTrialSessionsTableDeps
>(
  PublicMobileTrialSessionsTableDeps,
  function ({
    pageNumber,
    publicTrialSessionsHelper,
    ROOT,
    totalPages,
    updateFormValueSequence,
  }) {
    const { groupedTrialsSessions } = publicTrialSessionsHelper;
    return (
      <>
        <div className="width-full grid-row margin-bottom-2 flex-align-center">
          <div className="grid-col">
            <Paginator
              currentPageIndex={pageNumber}
              totalPages={totalPages}
              onPageChange={selectedPage => {
                updateFormValueSequence({
                  key: 'pageNumber',
                  root: ROOT,
                  value: selectedPage,
                });
              }}
            />
            <div className="grid-col-2"></div>
          </div>
        </div>
        <div className="grid-row margin-bottom-2 width-full flex-align-center"></div>
        <div className="width-full text-right">
          <span className="text-bold">Count:</span>{' '}
          <span className="text-semibold">
            {publicTrialSessionsHelper.trialSessionsCount}
          </span>
        </div>
        <div className="padding-1"></div>

        <table className="usa-table usa-table--stacked-header usa-table--borderless">
          <thead>
            <tr>
              <th scope="col">Document title</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {groupedTrialsSessions.map(tsGroup => {
              return (
                <tr
                  className="padding-0"
                  key={tsGroup.header.sessionWeekStartDate}
                >
                  <th data-label="Document title" scope="row">
                    {tsGroup.header.formattedSessionWeekStartDate}
                  </th>
                  {tsGroup.rows.map(tsRow => {
                    return (
                      <>
                        <td key={tsRow.formattedStartDate}>
                          <PublicMobileTrialSessionsDataRow
                            judgeName={tsRow.judge.name}
                            proceedingType={tsRow.proceedingType}
                            sessionType={tsRow.sessionType}
                            startDate={tsRow.formattedStartDate}
                            trialLocation={tsRow.trialLocation}
                            trialSessionId={tsRow.trialSessionId}
                          />
                        </td>
                      </>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  },
);
