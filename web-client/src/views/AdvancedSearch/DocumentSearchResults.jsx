import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { WarningNotificationComponent } from '../WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocumentSearchResults = connect(
  {
    MAX_SEARCH_RESULTS: state.constants.MAX_SEARCH_RESULTS,
    advancedDocumentSearchHelper: state.advancedDocumentSearchHelper,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
  },
  function DocumentSearchResults({
    advancedDocumentSearchHelper,
    MAX_SEARCH_RESULTS,
    openCaseDocumentDownloadUrlSequence,
    showMoreResultsSequence,
  }) {
    return (
      <div aria-live="polite">
        {advancedDocumentSearchHelper.showSearchResults && (
          <>
            <h1 className="margin-top-4">Search Results</h1>
            {advancedDocumentSearchHelper.showManyResultsMessage && (
              <WarningNotificationComponent
                alertWarning={{
                  message: 'Narrow your search by adding search terms.',
                  title: `Displaying the first ${MAX_SEARCH_RESULTS} matches of your search.`,
                }}
                dismissable={false}
                scrollToTop={false}
              />
            )}

            <table className="usa-table search-results ustc-table responsive-table">
              <thead>
                <tr>
                  <td aria-hidden="true" className="small-column"></td>
                  <td aria-hidden="true" className="small-column"></td>
                  <th aria-label="docket number">Docket No.</th>
                  <th>Case Title</th>
                  <th>{advancedDocumentSearchHelper.documentTypeVerbiage}</th>
                  <th>Pages</th>
                  <th>Date</th>
                  <th>Judge</th>
                </tr>
              </thead>
              <tbody>
                {advancedDocumentSearchHelper.formattedSearchResults.map(
                  (result, idx) => (
                    <tr className="search-result" key={result.docketEntryId}>
                      <td aria-hidden="true" className="small-column">
                        {idx + 1}
                      </td>
                      <td aria-hidden="true" className="small-column">
                        {advancedDocumentSearchHelper.showSealedIcon &&
                          result.isSealed && (
                            <Icon
                              aria-label="sealed"
                              className="iconSealed"
                              icon={['fa', 'lock']}
                              size="1x"
                            />
                          )}
                      </td>
                      <td>
                        <CaseLink formattedCase={result} />
                      </td>
                      <td>{result.caseTitle}</td>
                      <td>
                        <Button
                          link
                          onClick={() => {
                            openCaseDocumentDownloadUrlSequence({
                              docketEntryId: result.docketEntryId,
                              docketNumber: result.docketNumber,
                              isPublic: advancedDocumentSearchHelper.isPublic,
                              useSameTab: advancedDocumentSearchHelper.isPublic,
                            });
                          }}
                        >
                          {result.documentTitle}
                        </Button>
                      </td>
                      <td>{result.numberOfPagesFormatted}</td>
                      <td>{result.formattedFiledDate}</td>
                      <td>
                        {result.formattedSignedJudgeName ||
                          result.formattedJudgeName}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </>
        )}
        {advancedDocumentSearchHelper.showLoadMore && (
          <Button
            secondary
            aria-label={'load more results'}
            onClick={() => showMoreResultsSequence()}
          >
            Load More
          </Button>
        )}
        {advancedDocumentSearchHelper.showNoMatches && (
          <div id="no-search-results">
            <h1 className="margin-top-4">No Matches Found</h1>
            <p>Check your search terms and try again.</p>
          </div>
        )}
      </div>
    );
  },
);
