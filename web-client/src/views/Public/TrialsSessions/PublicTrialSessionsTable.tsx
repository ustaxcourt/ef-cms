import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { connect } from '@web-client/presenter/shared.cerebral';
import {
  isTrialSessionRow,
  isTrialSessionWeek,
} from '@web-client/presenter/computeds/trialSessionsHelper';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

type PublicTrialSessionsTableProps = {
  pageNumber: number;
  totalPages: number;
  ROOT: string;
};

const PublicTrialSessionsTableDeps = {
  publicTrialSessionsHelper: state.publicTrialSessionsHelper,
  updateFormValueSequence: sequences.updateFormValueSequence,
};

export const PublicTrialSessionsTable = connect<
  PublicTrialSessionsTableProps,
  typeof PublicTrialSessionsTableDeps
>(
  PublicTrialSessionsTableDeps,
  function ({
    pageNumber,
    publicTrialSessionsHelper,
    ROOT,
    totalPages,
    updateFormValueSequence,
  }) {
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
        <table
          aria-describedby="trial-sessions-filter-label locationFilter proceedingFilter sessionFilter judgeFilter"
          className="usa-table ustc-table trial-sessions"
        >
          <thead>
            <tr>
              <th className="width-card">Start Date</th>
              <th className="icon-column" />
              <th className="width-mobile">Location</th>
              <th className="width-card-lg">Proceeding Type</th>
              <th className="width-card">Session Type</th>
              <th className="width-card">Judge</th>
            </tr>
          </thead>
          {publicTrialSessionsHelper.trialSessionRows.map(row => {
            if (isTrialSessionWeek(row)) {
              return (
                <tbody key={row.formattedSessionWeekStartDate}>
                  <tr className="trial-date">
                    <td colSpan={100}>
                      <h4 className="margin-bottom-0">
                        {'Week of '}
                        {row.formattedSessionWeekStartDate}
                      </h4>
                    </td>
                  </tr>
                </tbody>
              );
            }
            if (isTrialSessionRow(row)) {
              return (
                <tbody key={row.trialSessionId}>
                  <tr
                    className="trial-sessions-row"
                    data-testid={`trial-sessions-row-${row.trialSessionId}`}
                  >
                    <td>
                      {row.showAlertForNOTTReminder && (
                        <FontAwesomeIcon
                          className="fa-icon-blue margin-right-05"
                          icon="clock"
                          size="sm"
                          title={row.alertMessageForNOTT}
                        />
                      )}
                      {row.formattedStartDate}
                    </td>
                    <td>
                      {row.swingSession && (
                        <FontAwesomeIcon
                          className="fa-icon-blue"
                          icon="link"
                          size="sm"
                          title="swing session"
                        />
                      )}
                    </td>
                    <td
                      data-testid={`trial-location-link-${row.trialSessionId}`}
                    >
                      <a
                        href={
                          row.userIsAssignedToSession
                            ? `/trial-session-working-copy/${row.trialSessionId}`
                            : `/trial-session-detail/${row.trialSessionId}`
                        }
                      >
                        {row.trialLocation}
                      </a>
                    </td>
                    <td>{row.proceedingType}</td>
                    <td>{row.sessionType}</td>
                    <td>{row.judge.name}</td>
                  </tr>
                </tbody>
              );
            }
          })}
        </table>
        {publicTrialSessionsHelper.trialSessionRows.length === 0 && (
          <p>There are no trial sessions for the selected filters.</p>
        )}
        <div className="padding-1" />
      </>
    );
  },
);
