import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useRef } from 'react';
import { CaseIcons } from '@web-client/ustc-ui/Icon/CaseIcons';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';

export const TrialLocationBlockedTable = connect(
  {
    setTrialLocationPaginatorSequence:
      sequences.setTrialLocationPaginatorSequence,
    trialLocationHelper: state.trialLocationHelper,
    trialLocationPage: state.trialLocationPage,
  },
  function TrialLocationBlockedTable({
    setTrialLocationPaginatorSequence,
    trialLocationHelper,
    trialLocationPage,
  }) {
    const paginatorTop = useRef(null);

    return (
      <>
        <div className="grid-row margin-bottom-2 flex-align-center">
          <div className="grid-col" ref={paginatorTop}>
            <Paginator
              currentPageIndex={trialLocationPage.blockedCasesPage}
              totalPages={trialLocationHelper.totalPagesBlocked}
              onPageChange={selectedPage => {
                setTrialLocationPaginatorSequence({
                  pageNumber: selectedPage,
                  pageType: 'blockedCasesPage',
                });
                focusPaginatorTop(paginatorTop);
              }}
            />
            <div className="grid-col-2"></div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-semibold">Count: </span>
          {trialLocationHelper.formattedBlockedCases.length}
        </div>
        <div className="padding-1"></div>
        <div className="overflow-x-auto">
          <div className="minw-tablet-lg">
            <table
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
              {trialLocationHelper.blockedCasesForDisplay.map(blockedCase => {
                return (
                  <tr key={blockedCase.docketNumber}>
                    <td>
                      <CaseIcons formattedCase={blockedCase} />
                    </td>
                    <td>
                      <CaseLink formattedCase={blockedCase} />
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
          currentPageIndex={trialLocationPage.blockedCasesPage}
          totalPages={trialLocationHelper.totalPagesBlocked}
          onPageChange={selectedPage => {
            setTrialLocationPaginatorSequence({
              pageNumber: selectedPage,
              pageType: 'blockedCasesPage',
            });
            focusPaginatorTop(paginatorTop);
          }}
        />
      </>
    );
  },
);

TrialLocationBlockedTable.displayName = 'TrialLocationBlockedTable';
