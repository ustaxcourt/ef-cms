import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useRef } from 'react';

export const PractitionerSearchResults = connect(
  {
    PRACTITIONER_SEARCH_PAGE_SIZE:
      state.constants.PRACTITIONER_SEARCH_PAGE_SIZE,
    practitionerSearchHelper: state.practitionerSearchHelper,
    submitPractitionerNameSearchSequence:
      sequences.submitPractitionerNameSearchSequence,
  },
  function PractitionerSearchResults({
    PRACTITIONER_SEARCH_PAGE_SIZE,
    practitionerSearchHelper,
    submitPractitionerNameSearchSequence,
  }) {
    const paginatorTop = useRef(null);
    const paginatorBottom = useRef(null);
    return (
      <>
        {practitionerSearchHelper.showSearchResults && (
          <>
            <h1 className="margin-top-4">Search Results</h1>
            <div ref={paginatorTop}>
              {practitionerSearchHelper.numberOfResults &&
                practitionerSearchHelper.numberOfResults >
                  PRACTITIONER_SEARCH_PAGE_SIZE && (
                  <Paginator
                    breakClassName="hide"
                    forcePage={practitionerSearchHelper.activePage || 0}
                    marginPagesDisplayed={0}
                    pageCount={practitionerSearchHelper.pageCount || 0}
                    pageRangeDisplayed={0}
                    onPageChange={pageChange => {
                      submitPractitionerNameSearchSequence({
                        selectedPage: pageChange.selected,
                      });
                      focusPaginatorTop(paginatorTop);
                    }}
                  />
                )}
            </div>
            <div className="text-right margin-bottom-2">
              <span className="text-bold" id="custom-case-result-count">
                Count: &nbsp;
              </span>
              <span data-testid="practitioner-search-result-count">
                {practitionerSearchHelper.numberOfResults}
              </span>
            </div>
            <table
              className="usa-table search-results ustc-table responsive-table"
              data-testid="practitioner-results-table"
            >
              <thead>
                <tr>
                  <th aria-label="bar number">Bar No.</th>
                  <th data-testid="results-table-header-name">Name</th>
                  <th data-testid="results-table-header-state">State</th>
                  <th data-testid="results-table-header-admission-status">
                    Admission Status
                  </th>
                  <th data-testid="results-table-header-admission-date">
                    Admission Date
                  </th>
                  <th data-testid="results-table-header-practitioner-type">
                    Practitioner Type
                  </th>
                  <th data-testid="results-table-header-practice-type">
                    Practice Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {practitionerSearchHelper.formattedSearchResults?.map(
                  result => (
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
                      <td>{result.contact?.stateFullName}</td>
                      <td>{result.admissionsStatus}</td>
                      <td>{result.formattedAdmissionsDate}</td>
                      <td>{result.practitionerType}</td>
                      <td>{result.practiceType}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            <div ref={paginatorBottom}>
              {practitionerSearchHelper.numberOfResults &&
                practitionerSearchHelper.numberOfResults >
                  PRACTITIONER_SEARCH_PAGE_SIZE && (
                  <Paginator
                    breakClassName="hide"
                    forcePage={practitionerSearchHelper.activePage || 0}
                    marginPagesDisplayed={0}
                    pageCount={practitionerSearchHelper.pageCount || 0}
                    pageRangeDisplayed={0}
                    onPageChange={pageChange => {
                      submitPractitionerNameSearchSequence({
                        selectedPage: pageChange.selected,
                      });
                      focusPaginatorTop(paginatorTop);
                    }}
                  />
                )}
            </div>
          </>
        )}
        {practitionerSearchHelper.showNoMatches && (
          <div data-testid="no-search-results" id="no-search-results">
            <h1 className="margin-top-4">No Matches Found</h1>
            <p>Check your search terms and try again.</p>
          </div>
        )}
      </>
    );
  },
);

PractitionerSearchResults.displayName = 'PractitionerSearchResults';
