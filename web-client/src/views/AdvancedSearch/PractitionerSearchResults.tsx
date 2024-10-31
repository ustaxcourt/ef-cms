import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
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
              {practitionerSearchHelper.showPaginator && (
                <Paginator
                  currentPageIndex={practitionerSearchHelper.activePage}
                  showSinglePage={true}
                  totalPages={practitionerSearchHelper.pageCount}
                  onPageChange={pageChange => {
                    submitPractitionerNameSearchSequence({
                      selectedPage: pageChange,
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
            <NonMobile>
              <table
                className="usa-table search-results ustc-table responsive-table"
                data-testid="practitioner-results-table"
              >
                <thead>
                  <tr>
                    <th aria-label="bar number">Bar No.</th>
                    <th data-testid="results-table-header-name">Name</th>
                    <th data-testid="results-table-header-state">
                      {practitionerSearchHelper.stateHeaderText}
                    </th>
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
                          {practitionerSearchHelper.isPublicUser ? (
                            <span>{result.barNumber}</span>
                          ) : (
                            <a
                              href={`/practitioner-detail/${result.barNumber}`}
                            >
                              {result.barNumber}
                            </a>
                          )}
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
            </NonMobile>

            <Mobile>
              {practitionerSearchHelper.formattedSearchResults?.map(result => (
                <div
                  className="search-result width-full margin-bottom-2 shadow-3 border border-base-lightest padding-2"
                  key={result.barNumber}
                >
                  <h2 className="padding-bottom-2 border-bottom border-base-lightest">
                    {result.name}
                  </h2>
                  <div className="width-auto grid-row">
                    <div className="grid-col flex-1">
                      <div>
                        <b>Original Bar State</b>
                        <p className="margin-top-1 margin-bottom-1">
                          {result.contact?.stateFullName}
                        </p>
                      </div>
                      <div>
                        <b>Admission Date</b>
                        <p className="margin-top-1 margin-bottom-1">
                          {result.formattedAdmissionsDate}
                        </p>
                      </div>
                      <div>
                        <b>Practitioner Type</b>
                        <p className="margin-top-1 margin-bottom-1">
                          {result.practitionerType}
                        </p>
                      </div>
                    </div>
                    <div className="grid-col flex-1">
                      <div>
                        <b>Bar No.</b>
                        <p className="margin-top-1 margin-bottom-1">
                          {result.barNumber}
                        </p>
                      </div>
                      <div>
                        <b>Admission Status</b>
                        <p className="margin-top-1 margin-bottom-1">
                          {result.admissionsStatus}
                        </p>
                      </div>
                      <div>
                        <b>Practice Type</b>
                        <p className="margin-top-1 margin-bottom-1">
                          {result.practiceType}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Mobile>
            <div ref={paginatorBottom}>
              {practitionerSearchHelper.showPaginator && (
                <Paginator
                  currentPageIndex={practitionerSearchHelper.activePage}
                  showSinglePage={true}
                  totalPages={practitionerSearchHelper.pageCount}
                  onPageChange={pageChange => {
                    submitPractitionerNameSearchSequence({
                      selectedPage: pageChange,
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
