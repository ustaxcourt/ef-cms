import { connect } from '@web-client/presenter/shared.cerebral';
import { CaseIcons } from '@web-client/ustc-ui/Icon/CaseIcons';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useRef } from 'react';
import { useClientSidePaginator } from '@web-client/utilities/useClientSidePaginator';

export const TrialLocationEligibleCasesTable = connect(
  {
    trialLocationHelper: state.trialLocationHelper,
    trialLocationPage: state.trialLocationPage,
  },
  function TrialLocationEligibleCasesTable({
    trialLocationHelper,
    trialLocationPage,
  }) {
    const paginatorTop = useRef(null);
    const { activePage, pageRecords, setActivePage, totalPages } =
      useClientSidePaginator(trialLocationHelper.formattedEligibleCases, 100);

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
        <div className="text-right" data-testId="eligible-cases-count">
          <span className="text-semibold">Count: </span>
          {trialLocationHelper.formattedEligibleCases.length}
        </div>
        <div className="padding-1"></div>
        <div className="overflow-x-auto">
          <div className="minw-tablet-lg">
            <table
              aria-label={`${trialLocationPage.currentTab}`}
              data-testid="trial-location-eligible-table"
              className="usa-table ustc-table trial-sessions"
              id={`${trialLocationPage.currentTab}`}
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
                  <th className="width-card-lg">Case Title</th>
                  <th className="width-mobile">Petitioner Counsel</th>
                  <th className="width-card">Respondent Counsel</th>
                  <th className="width-card">Case Type</th>
                </tr>
              </thead>
              {pageRecords.map(eligibleCase => {
                return (
                  <tbody key={eligibleCase.docketNumber}>
                    <tr>
                      <td>
                        <CaseIcons formattedCase={eligibleCase} />
                      </td>
                      <td>
                        <CaseLink
                          formattedCase={eligibleCase}
                          target="_blank"
                        />
                      </td>
                      <td>{eligibleCase.caseTitle}</td>
                      <td>
                        {eligibleCase.privatePractitioners?.map(
                          practitioner => (
                            <div key={practitioner.userId}>
                              {practitioner.name}
                            </div>
                          ),
                        )}
                      </td>
                      <td>
                        {eligibleCase.irsPractitioners?.map(practitioner => (
                          <div key={practitioner.userId}>
                            {practitioner.name}
                          </div>
                        ))}
                      </td>
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

TrialLocationEligibleCasesTable.displayName = 'TrialLocationEligibleCasesTable';
