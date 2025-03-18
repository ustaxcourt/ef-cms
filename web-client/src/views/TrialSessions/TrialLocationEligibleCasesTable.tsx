import { connect } from '@web-client/presenter/shared.cerebral';
import { CaseIcons } from '@web-client/ustc-ui/Icon/CaseIcons';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useRef } from 'react';

export const TrialLocationEligibleCasesTable = connect(
  {
    setTrialLocationPaginatorSequence:
      sequences.setTrialLocationPaginatorSequence,
    trialLocationHelper: state.trialLocationHelper,
    trialLocationPage: state.trialLocationPage,
  },
  function TrialLocationEligibleCasesTable({
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
              currentPageIndex={trialLocationPage.eligibleCasesPage}
              totalPages={trialLocationHelper.totalPagesEligible}
              onPageChange={selectedPage => {
                setTrialLocationPaginatorSequence({
                  pageNumber: selectedPage,
                  pageType: 'eligibleCasesPage',
                });
                focusPaginatorTop(paginatorTop);
              }}
            />
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
              aria-label={`${trialLocationPage.currentTab}`}
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
              {trialLocationHelper.eligibleCasesForDisplay.map(eligibleCase => {
                return (
                  <tbody key={eligibleCase.docketNumber}>
                    <tr>
                      <td>
                        <CaseIcons formattedCase={eligibleCase} />
                      </td>
                      <td>
                        <CaseLink formattedCase={eligibleCase} />
                      </td>
                      <td>{eligibleCase.caseTitle}</td>
                      <td>
                        {eligibleCase.privatePractitioners.map(practitioner => (
                          <div key={practitioner.userId}>
                            {practitioner.name}
                          </div>
                        ))}
                      </td>
                      <td>
                        {eligibleCase.irsPractitioners.map(practitioner => (
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
        {trialLocationHelper.eligibleCasesForDisplay.length === 0 && (
          <p>There are no eligible cases.</p>
        )}
        <div className="padding-1" />

        <Paginator
          currentPageIndex={trialLocationPage.eligibleCasesPage}
          totalPages={trialLocationHelper.totalPagesEligible}
          onPageChange={selectedPage => {
            setTrialLocationPaginatorSequence({
              pageNumber: selectedPage,
              pageType: 'eligibleCasesPage',
            });
            focusPaginatorTop(paginatorTop);
          }}
        />
      </>
    );
  },
);

TrialLocationEligibleCasesTable.displayName = 'TrialLocationEligibleCasesTable';
