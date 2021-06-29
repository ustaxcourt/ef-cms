import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { WarningNotificationComponent } from '../WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SearchResults = connect(
  {
    MAX_SEARCH_RESULTS: state.constants.MAX_SEARCH_RESULTS,
    advancedSearchHelper: state.advancedSearchHelper,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
  },
  function SearchResults({
    advancedSearchHelper,
    MAX_SEARCH_RESULTS,
    showMoreResultsSequence,
  }) {
    return (
      <div aria-live="polite">
        {advancedSearchHelper.showSearchResults && (
          <>
            {advancedSearchHelper.showManyResultsMessage && (
              <div className="margin-top-4">
                <WarningNotificationComponent
                  alertWarning={{
                    message: 'Narrow your search by adding search terms.',
                    title: `Displaying the first ${MAX_SEARCH_RESULTS} matches of your search.`,
                  }}
                  dismissable={false}
                  messageNotBold={true}
                  scrollToTop={false}
                />
              </div>
            )}
            <div className="grid-row">
              <div className="tablet:grid-col-10">
                <h1 className="margin-top-1">Results</h1>
              </div>
              <div className="tablet:grid-col-2 float-right text-right text-middle-margin">
                {advancedSearchHelper.numberOfResults} match(es) shown
              </div>
            </div>

            <table className="usa-table search-results ustc-table responsive-table">
              <thead>
                <tr>
                  <th aria-label="Number"></th>
                  <NonMobile>
                    <th>Petitioner(s)</th>
                  </NonMobile>
                  <th>Docket Number</th>
                  <NonMobile>
                    <th>Date Filed</th>
                    <th>Case Title</th>
                    <th>State</th>
                  </NonMobile>
                  <Mobile>
                    <th>Case Title</th>
                  </Mobile>
                </tr>
              </thead>
              <tbody>
                {advancedSearchHelper.formattedSearchResults.map(
                  (result, idx) => (
                    <tr className="search-result" key={result.docketNumber}>
                      <td className="center-column">{idx + 1}</td>
                      <NonMobile>
                        <td>
                          {result.petitioners.map(p => (
                            <div key={p.contactId}>{p.name}</div>
                          ))}
                        </td>
                      </NonMobile>
                      <td>
                        <CaseLink formattedCase={result} />
                      </td>
                      <NonMobile>
                        <td>{result.formattedFiledDate}</td>
                        <td>{result.caseTitle}</td>
                        <td>
                          {result.petitionerFullStateNames.map(p => (
                            <div key={p.contactId}>{p.state}</div>
                          ))}
                        </td>
                      </NonMobile>
                      <Mobile>
                        <td>
                          <div>{result.caseTitle}</div>
                          <div className="margin-top-2">
                            Filed {result.formattedFiledDate}
                          </div>
                        </td>
                      </Mobile>
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
            <Hint wider>
              Tips for improving your search:
              <ul className="usa-list">
                <li>Try alternate spellings for your search terms</li>
                <li>Use more general search terms</li>
                <li>Use fewer search terms to broaden your search</li>
              </ul>
            </Hint>
          </div>
        )}
      </div>
    );
  },
);
