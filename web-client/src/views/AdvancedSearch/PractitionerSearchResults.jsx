import { Button } from '../../ustc-ui/Button/Button';
import { WarningNotificationComponent } from '../WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PractitionerSearchResults = connect(
  {
    advancedSearchHelper: state.advancedSearchHelper,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
  },
  function PractitionerSearchResults({
    advancedSearchHelper,
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
                  message:
                    'Your search has a high number of matching results. Refine your search for more accurate results.',
                }}
                dismissable={false}
              />
            )}
            <table className="usa-table search-results docket-record responsive-table row-border-only">
              <thead>
                <tr>
                  <th aria-label="bar number">Bar No.</th>
                  <th>Name</th>
                  <th>State</th>
                  <th>Admissions Status</th>
                </tr>
              </thead>
              <tbody>
                {advancedSearchHelper.formattedSearchResults.map(
                  (result, idx) => (
                    <tr className="search-result" key={idx}>
                      <td>
                        <a href={`/practitioner-detail/${result.barNumber}`}>
                          {result.barNumber}
                        </a>
                      </td>
                      <td>{result.name}</td>
                      <td>{result.contact.state}</td>
                      <td>{result.admissionsStatus}</td>
                    </tr>
                  ),
                )}
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
