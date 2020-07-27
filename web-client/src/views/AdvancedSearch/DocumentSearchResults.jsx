import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocumentSearchResults = connect(
  {
    advancedDocumentSearchHelper: state.advancedDocumentSearchHelper,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
  },
  function DocumentSearchResults({
    advancedDocumentSearchHelper,
    openCaseDocumentDownloadUrlSequence,
    showMoreResultsSequence,
  }) {
    return (
      <>
        {advancedDocumentSearchHelper.showSearchResults && (
          <>
            <h1 className="margin-top-4">
              ({advancedDocumentSearchHelper.searchResultsCount}) Results
            </h1>

            <table className="usa-table search-results docket-record responsive-table row-border-only">
              <thead>
                <tr>
                  <th aria-hidden="true" className="small-column"></th>
                  <th aria-hidden="true" className="small-column"></th>
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
                    <tr className="search-result" key={idx}>
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
                              docketNumber: result.docketNumber,
                              documentId: result.documentId,
                              isPublic: advancedDocumentSearchHelper.isPublic,
                            });
                          }}
                        >
                          {result.documentTitle}
                        </Button>
                      </td>
                      <td>{result.numberOfPages}</td>
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
      </>
    );
  },
);
