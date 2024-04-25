import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { formatPositiveNumber } from '@shared/business/utilities/formatPositiveNumber';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useRef, useState } from 'react';

export const PractitionerSearchResults = connect(
  {
    PRACTITIONER_SEARCH_PAGE_SIZE:
      state.constants.PRACTITIONER_SEARCH_PAGE_SIZE,
    practitionerSearchHelper: state.practitionerSearchHelper,
  },
  function PractitionerSearchResults({
    PRACTITIONER_SEARCH_PAGE_SIZE,
    practitionerSearchHelper,
  }) {
    const [activePage, setActivePage] = useState(0);
    const paginatorTop = useRef(null);

    console.log('helper', practitionerSearchHelper);

    return (
      <>
        {practitionerSearchHelper.showSearchResults && (
          <>
            <h1 className="margin-top-4">Search Results</h1>
            <div ref={paginatorTop}>
              {practitionerSearchHelper.numberOfResults >
                PRACTITIONER_SEARCH_PAGE_SIZE && (
                <Paginator
                  breakClassName="hide"
                  forcePage={activePage}
                  marginPagesDisplayed={0}
                  pageCount={practitionerSearchHelper.numberOfResults}
                  pageRangeDisplayed={0}
                  onPageChange={pageChange => {
                    setActivePage(pageChange.selected);
                    // await getCustomCaseReportSequence({
                    //   selectedPage: pageChange.selected,
                    // });
                    focusPaginatorTop(paginatorTop);
                  }}
                />
              )}
            </div>
            <div className="text-right margin-bottom-2">
              <span className="text-bold" id="custom-case-result-count">
                Count: &nbsp;
              </span>
              <span data-testid="custom-case-report-count">
                {formatPositiveNumber(practitionerSearchHelper.numberOfResults)}
              </span>
            </div>
            <table className="usa-table search-results ustc-table responsive-table">
              <thead>
                <tr>
                  <th aria-label="bar number">Bar No.</th>
                  <th>Name</th>
                  <th>State</th>
                  <th>Admission Status</th>
                  <th>Admission Date</th>
                  <th>Practitioner Type</th>
                  <th>Practice Type</th>
                </tr>
              </thead>
              <tbody>
                {practitionerSearchHelper.formattedSearchResults.map(result => (
                  <tr
                    className="search-result"
                    data-testid={`practitioner-row-${result.barNumber}`}
                    key={result.barNumber}
                  >
                    <td>
                      <a href={`/practitioner-detail/${result.barNumber}`}>
                        {result.barNumber}
                      </a>
                    </td>
                    <td>{result.name}</td>
                    <td>{result.contact.stateFullName}</td>
                    <td>{result.admissionsStatus}</td>
                    <td>{result.formattedAdmissionsDate}</td>
                    <td>{result.practitionerType}</td>
                    <td>{result.practiceType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {practitionerSearchHelper.showNoMatches && (
          <div id="no-search-results">
            <h1 className="margin-top-4">No Matches Found</h1>
            <p>Check your search terms and try again.</p>
          </div>
        )}
      </>
    );
  },
);

PractitionerSearchResults.displayName = 'PractitionerSearchResults';
