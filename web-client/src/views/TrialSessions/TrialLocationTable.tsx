/*
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
*/
// import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { connect } from '@web-client/presenter/shared.cerebral';
// import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
// import { trialLocationHelper } from '@web-client/presenter/computeds/trialLocationHelper';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useRef } from 'react';

export const TrialLocationTable = connect(
  {
    currentTab: state.trialLocationPage.currentTab,
    trialLocationHelper: state.trialLocationHelper,
  },
  function TrialLocationTable({ currentTab, trialLocationHelper }) {
    const paginatorTop = useRef(null);

    return (
      <>
        <div className="grid-row margin-bottom-2 flex-align-center">
          <div className="grid-col" ref={paginatorTop}>
            {/*<Paginator*/}
            {/*  // currentPageIndex={trialLocationHelper.pageNumber}*/}
            {/*  totalPages={trialLocationHelper.totalPages}*/}
            {/*  onPageChange={selectedPage => {*/}
            {/*    setTrialSessionsFiltersSequence({*/}
            {/*      pageNumber: selectedPage,*/}
            {/*    });*/}
            {/*    focusPaginatorTop(paginatorTop);*/}
            {/*  }}*/}
            {/*/>*/}
            <div className="grid-col-2"></div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-semibold">Count: </span>
          {trialLocationHelper.eligibleCases.length}
        </div>
        <div className="padding-1"></div>
        <div className="overflow-x-auto">
          <div className="minw-tablet-lg">
            <table
              aria-label={`${currentTab}`}
              className="usa-table ustc-table trial-sessions"
              id={`${currentTab}`}
            >
              <thead>
                <tr>
                  <th className="icon-column" />
                  <th className="width-card">Docket No.</th>
                  <th className="width-mobile">Case Title</th>
                  <th className="width-card-lg">Petitioner Counsel</th>
                  <th className="width-card">Respondent Counsel</th>
                  <th className="width-card">Case Type</th>
                </tr>
              </thead>
              {trialLocationHelper.eligibleCases.map(eligibleCase => {
                return (
                  <tr>
                    <td></td>
                    <td>{eligibleCase.docketNumber}</td>
                    <td>{eligibleCase.caseTitle}</td>
                    <td>{eligibleCase.privatePractitioners}</td>
                    <td>{eligibleCase.irsPractitioners}</td>
                    <td>{eligibleCase.caseType}</td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
        {trialLocationHelper.eligibleCases.length === 0 && (
          <p>There are no trial sessions for the selected filters.</p>
        )}
        <div className="padding-1" />

        {/*<Paginator
          currentPageIndex={trialLocationHelper.filters.pageNumber}
          totalPages={trialLocationHelper.totalPages}
          onPageChange={selectedPage => {
            setTrialSessionsFiltersSequence({ pageNumber: selectedPage });
            focusPaginatorTop(paginatorTop);
          }}
        />*/}
      </>
    );
  },
);

TrialLocationTable.displayName = 'TrialLocationTable';
