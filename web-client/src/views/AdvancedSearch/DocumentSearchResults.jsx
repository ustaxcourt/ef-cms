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
            {advancedDocumentSearchHelper.showManyResultsMessage && (
              <div className="margin-top-4">
                <WarningNotificationComponent
                  alertWarning={{
                    message: 'Refine your search by adding search criteria.',
                    title: `Displaying the first ${MAX_SEARCH_RESULTS} matches of your search.`,
                  }}
                  dismissable={false}
                  scrollToTop={false}
                />
              </div>
            )}
            <div className="grid-row">
              <div className="tablet:grid-col-10">
                <h1 className="margin-top-1">Results</h1>
              </div>
              <div className="tablet:grid-col-2 float-right text-right text-middle-margin">
                {advancedDocumentSearchHelper.numberOfResults} match(es) shown
              </div>
            </div>

            <table className="usa-table search-results ustc-table responsive-table">
              <thead>
                <tr>
                  <th aria-hidden="true" className="small-column"></th>
                  <th aria-hidden="true" className="small-column"></th>
                  <th>Date</th>
                  <th>{advancedDocumentSearchHelper.documentTypeVerbiage}</th>
                  <th>Case Title</th>
                  <th>Judge</th>
                  <th>Pages</th>
                  <th aria-label="docket number">Docket No.</th>
                </tr>
              </thead>
              <tbody>
                {advancedDocumentSearchHelper.formattedSearchResults.map(
                  (result, idx) => (
                    <tr
                      className="search-result"
                      key={`${result.docketEntryId}-${result.docketNumber}`}
                    >
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
                      <td>{result.formattedFiledDate}</td>
                      <td>
                        <Button
                          link
                          className="padding-0"
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
                      <td>{result.caseTitle}</td>
                      <td>
                        {result.formattedSignedJudgeName ||
                          result.formattedJudgeName}
                      </td>
                      <td>{result.numberOfPagesFormatted}</td>
                      <td>
                        <CaseLink
                          formattedCase={result}
                          rel="noreferrer"
                          target="_blank"
                        />
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
