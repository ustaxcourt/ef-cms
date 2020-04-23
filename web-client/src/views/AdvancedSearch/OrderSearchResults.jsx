import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrderSearchResults = connect(
  {
    advancedOrderSearchHelper: state.advancedOrderSearchHelper,
    baseUrl: state.baseUrl,
    pageSize: state.constants.CASE_SEARCH_PAGE_SIZE,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
    token: state.token,
  },
  function OrderSearchResults({
    advancedOrderSearchHelper,
    baseUrl,
    pageSize,
    showMoreResultsSequence,
    token,
  }) {
    return (
      <>
        {advancedOrderSearchHelper.showSearchResults && (
          <>
            <h1 className="margin-top-4">
              ({advancedOrderSearchHelper.searchResultsCount}) Results
            </h1>

            <table className="usa-table search-results responsive-table row-border-only">
              <thead>
                <tr>
                  <th aria-hidden="true"></th>
                  <th>Docket number</th>
                  <th>Case title</th>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Judge</th>
                </tr>
              </thead>
              <tbody>
                {advancedOrderSearchHelper.formattedSearchResults.map(
                  (result, idx) => (
                    <tr className="search-result" key={idx}>
                      <td aria-hidden="true">{idx + 1}</td>
                      <td>
                        <CaseLink formattedCase={result} />
                      </td>
                      <td>{result.caseTitle}</td>
                      <td>
                        <a
                          href={`${baseUrl}/case-documents/${result.caseId}/${result.documentId}/document-download-url?token=${token}`}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {result.documentTitle}
                        </a>
                      </td>
                      <td>{result.formattedFiledDate}</td>
                      <td>{result.formattedSignedJudgeName}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </>
        )}
        {advancedOrderSearchHelper.showLoadMore && (
          <Button secondary onClick={() => showMoreResultsSequence()}>
            Load {pageSize} More
          </Button>
        )}
        {advancedOrderSearchHelper.showNoMatches && (
          <div id="no-search-results">
            <h1 className="margin-top-4">No Matches Found</h1>
            <p>Check your search terms and try again.</p>
          </div>
        )}
      </>
    );
  },
);
