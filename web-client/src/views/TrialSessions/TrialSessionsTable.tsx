import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import {
  isTrialSessionRow,
  isTrialSessionWeek,
} from '@web-client/presenter/computeds/trialSessionsHelper';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useRef } from 'react';

export const TrialSessionsTable = connect(
  {
    setTrialSessionsFiltersSequence: sequences.setTrialSessionsFiltersSequence,
    trialSessionsHelper: state.trialSessionsHelper,
    trialSessionsPage: state.trialSessionsPage,
  },
  function TrialSessionsTable({
    setTrialSessionsFiltersSequence,
    trialSessionsHelper,
    trialSessionsPage,
  }) {
    const paginatorTop = useRef(null);

    return (
      <>
        <div className="grid-row margin-bottom-2 flex-align-center">
          <div className="grid-col" ref={paginatorTop}>
            <Paginator
              currentPageIndex={trialSessionsPage.filters.pageNumber}
              totalPages={trialSessionsHelper.totalPages}
              onPageChange={selectedPage => {
                setTrialSessionsFiltersSequence({
                  pageNumber: selectedPage,
                });
                focusPaginatorTop(paginatorTop);
              }}
            />
            <div className="grid-col-2"></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="minw-tablet-lg ">
            <div className="text-right">
              <span className="text-bold">Count:</span>{' '}
              <span className="text-semibold">
                {trialSessionsHelper.trialSessionsCount}
              </span>
            </div>
            <div className="padding-1"></div>
            <table
              aria-describedby="trial-sessions-filter-label locationFilter proceedingFilter sessionFilter judgeFilter"
              aria-label={`${trialSessionsPage.filters.currentTab} trial sessions`}
              className="usa-table ustc-table trial-sessions"
              id={`${trialSessionsPage.filters.currentTab}-sessions`}
            >
              <thead>
                <tr>
                  <th className="width-card">Start Date</th>
                  <th className="width-card">Est. End Date</th>
                  <th className="icon-column" />
                  <th className="width-mobile">Location</th>
                  <th className="width-card-lg">Proceeding Type</th>
                  <th className="width-card">Session Type</th>
                  <th className="width-card">Judge</th>
                  {trialSessionsHelper.showNoticeIssued && (
                    <th className="width-card">Notice Issued</th>
                  )}
                  {trialSessionsHelper.showSessionStatus && (
                    <th className="width-card">Session Status</th>
                  )}
                </tr>
              </thead>
              {trialSessionsHelper.trialSessionRows.map(row => {
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
                        <td>{row.formattedEstimatedEndDate}</td>
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
                        {trialSessionsHelper.showNoticeIssued && (
                          <td>{row.formattedNoticeIssuedDate}</td>
                        )}
                        {trialSessionsHelper.showSessionStatus && (
                          <td>{row.sessionStatus}</td>
                        )}
                      </tr>
                    </tbody>
                  );
                }
              })}
            </table>
          </div>
        </div>
        {trialSessionsHelper.trialSessionRows.length === 0 && (
          <p>There are no trial sessions for the selected filters.</p>
        )}
        <div className="padding-1" />

        <Paginator
          currentPageIndex={trialSessionsPage.filters.pageNumber}
          totalPages={trialSessionsHelper.totalPages}
          onPageChange={selectedPage => {
            setTrialSessionsFiltersSequence({ pageNumber: selectedPage });
            focusPaginatorTop(paginatorTop);
          }}
        />
      </>
    );
  },
);

TrialSessionsTable.displayName = 'TrialSessionsTable';
