import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useRef } from 'react';
import { CaseIcons } from '@web-client/ustc-ui/Icon/CaseIcons';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { useClientSidePaginator } from '@web-client/utilities/useClientSidePaginator';

export const TrialLocationBlockedTable = connect(
  {
    trialLocationHelper: state.trialLocationHelper,
    trialLocationPage: state.trialLocationPage,
  },
  function TrialLocationBlockedTable({
    trialLocationHelper,
    trialLocationPage,
  }) {
    const paginatorTop = useRef(null);
    const { activePage, pageRecords, setActivePage, totalPages } =
      useClientSidePaginator(trialLocationHelper.formattedBlockedCases, 100);

    return (
      <>
        {totalPages > 1 && (
          <div className="grid-row margin-bottom-2 flex-align-center">
            <div className="grid-col" ref={paginatorTop}>
              <Paginator
                currentPageIndex={activePage}
                totalPages={totalPages}
                onPageChange={pageChange => {
                  setActivePage(pageChange);
                  focusPaginatorTop(paginatorTop);
                }}
              />
              <div className="grid-col-2"></div>
            </div>
          </div>
        )}
        <div className="text-right" data-testId="blocked-cases-count">
          <span className="text-semibold">Count: </span>
          {trialLocationHelper.formattedBlockedCases.length}
        </div>
        <div className="padding-1"></div>
        <div className="overflow-x-auto">
          <div className="minw-tablet-lg">
            <table
              data-testid="trial-location-blocked-table"
              className="usa-table ustc-table trial-sessions"
              aria-label={`${trialLocationPage.currentTab}`}
            >
              <thead>
                <tr>
                  <th
                    aria-label="Icons for consolidated cases"
                    className="icon-column"
                  />
                  <th className="width-10">Docket No.</th>
                  <th className="width-10">Date Blocked</th>
                  <th className="width-card">Case Title</th>
                  <th className="width-card-lg">Case Status</th>
                  <th className="width-card">Reason</th>
                </tr>
              </thead>
              {pageRecords.map(blockedCase => {
                return (
                  <tbody key={blockedCase.docketNumber}>
                    <tr>
                      <td>
                        <CaseIcons formattedCase={blockedCase} />
                      </td>
                      <td>
                        <CaseLink formattedCase={blockedCase} target="_blank" />
                      </td>
                      <td>{blockedCase.blockedDateEarliest}</td>
                      <td>{blockedCase.caseTitle}</td>
                      <td>{blockedCase.status}</td>
                      <td>
                        {blockedCase.blockedReason}
                        {blockedCase.blockedReason &&
                          blockedCase.automaticBlockedReason && <br />}
                        {blockedCase.automaticBlockedReason}
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
        {trialLocationHelper.formattedBlockedCases.length === 0 && (
          <p>There are no blocked cases.</p>
        )}
        <div className="padding-1" />

        <Paginator
          currentPageIndex={activePage}
          totalPages={totalPages}
          onPageChange={pageChange => {
            setActivePage(pageChange);
            focusPaginatorTop(paginatorTop);
          }}
        />
      </>
    );
  },
);

TrialLocationBlockedTable.displayName = 'TrialLocationBlockedTable';
