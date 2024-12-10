import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useRef } from 'react';

export const TrialLocationBlockedTable = connect(
  {
    blockedCases: state.blockedCases,
  },
  function TrialLocationBlockedTable({ blockedCases }) {
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
          {blockedCases.length}
        </div>
        <div className="padding-1"></div>
        <div className="overflow-x-auto">
          <div className="minw-tablet-lg">
            <table className="usa-table ustc-table trial-sessions">
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
              {blockedCases.map(blockedCase => {
                return (
                  <tr key={blockedCase.docketNumber}>
                    <td></td>
                    <td> {blockedCase.docketNumberWithSuffix}</td>
                    <td>{blockedCase.caseTitle}</td>
                    <td>{blockedCase.privatePractitioners}</td>
                    <td>{blockedCase.irsPractitioners}</td>
                    <td>{blockedCase.caseType}</td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
        {blockedCases.length === 0 && <p>There are no eligible cases.</p>}
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

TrialLocationBlockedTable.displayName = 'TrialLocationBlockedTable';
