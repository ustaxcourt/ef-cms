import { Button } from '../../ustc-ui/Button/Button';
import { WarningNotificationComponent } from '../WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

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
            <table className="usa-table search-results ustc-table responsive-table">
              <thead>
                <tr>
                  <th aria-label="bar number">Bar No.</th>
                  <th>Name</th>
                  <th>State</th>
                  <th>Admissions Status</th>
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
