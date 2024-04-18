import { Button } from '../../ustc-ui/Button/Button';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { WarningNotificationComponent } from '../WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { formatPositiveNumber } from '@shared/business/utilities/formatPositiveNumber';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useRef, useState } from 'react';

export const PractitionerSearchResults = connect(
  {
    MAX_SEARCH_RESULTS: state.constants.MAX_SEARCH_RESULTS,
    advancedSearchHelper: state.advancedSearchHelper,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
  },
  function PractitionerSearchResults({
    advancedSearchHelper,
    MAX_SEARCH_RESULTS,
    showMoreResultsSequence,
  }) {
    const [activePage, setActivePage] = useState(0);
    const paginatorTop = useRef(null);

    return (
      <>
        {advancedSearchHelper.showSearchResults && (
          <>
            <h1 className="margin-top-4">Search Results</h1>
            {advancedSearchHelper.showManyResultsMessage && (
              <WarningNotificationComponent
                alertWarning={{
                  message: 'Narrow your search by adding search terms.',
                  title: `Displaying the first ${MAX_SEARCH_RESULTS} matches of your search.`,
                }}
                dismissible={false}
                scrollToTop={false}
              />
            )}
            <div ref={paginatorTop}>
              {advancedSearchHelper.numberOfResults > 1 && (
                <Paginator
                  breakClassName="hide"
                  forcePage={activePage}
                  marginPagesDisplayed={0}
                  pageCount={advancedSearchHelper.numberOfResults}
                  pageRangeDisplayed={0}
                  onPageChange={async pageChange => {
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
                {formatPositiveNumber(advancedSearchHelper.numberOfResults)}
              </span>
            </div>
            <table className="usa-table search-results ustc-table responsive-table">
              <thead>
                <tr>
                  <th aria-label="bar number">Bar No.</th>
                  <th>Name</th>
                  <th>State</th>
                  <th>Admissions Status</th>
                  <th>Admissions Date</th>
                  <th>Practitioner Type</th>
                  <th>Practice Type</th>
                </tr>
              </thead>
              <tbody>
                {advancedSearchHelper.formattedSearchResults.map(result => (
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
                    <td>{result.contact.state}</td>
                    <td>{result.admissionsStatus}</td>
                    <td>{result.admissionsDate}</td>
                    <td>{result.practitionerType}</td>
                    <td>{result.practiceType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {advancedSearchHelper.showLoadMore && (
          <Button secondary onClick={() => showMoreResultsSequence()}>
            Load More
          </Button>
        )}
        {advancedSearchHelper.showNoMatches && (
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
