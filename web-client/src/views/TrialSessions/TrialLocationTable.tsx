import { connect } from '@web-client/presenter/shared.cerebral';
// import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { CaseIcons } from '@web-client/ustc-ui/Icon/CaseIcons';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useRef } from 'react';
import classNames from 'classnames';

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
          {trialLocationHelper.formattedEligibleCases.length}
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
                  <th
                    aria-label="Icons for consolidated cases"
                    className="icon-column"
                  />
                  <th aria-label="Docket Number" className="width-card">
                    Docket No.
                  </th>
                  <th className="width-mobile">Case Title</th>
                  <th className="width-card-lg">Petitioner Counsel</th>
                  <th className="width-card">Respondent Counsel</th>
                  <th className="width-card">Case Type</th>
                </tr>
              </thead>
              {trialLocationHelper.formattedEligibleCases.map(eligibleCase => {
                return (
                  <tbody key={eligibleCase.docketNumber}>
                    <tr>
                      <td>
                        {/* TODO: should highPriority cases get an icon? */}
                        <CaseIcons
                          formattedCase={eligibleCase}
                          shouldIndent={eligibleCase.shouldIndent}
                        />
                      </td>
                      <td>
                        <span
                          className={classNames({
                            'margin-left-2': eligibleCase.shouldIndent,
                          })}
                        >
                          <CaseLink formattedCase={eligibleCase} />
                        </span>
                      </td>
                      <td>{eligibleCase.caseTitle}</td>
                      <td>{eligibleCase.privatePractitioners}</td>
                      <td>{eligibleCase.irsPractitioners}</td>
                      <td>{eligibleCase.caseType}</td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
        {trialLocationHelper.formattedEligibleCases.length === 0 && (
          <p>There are no eligible cases.</p>
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
