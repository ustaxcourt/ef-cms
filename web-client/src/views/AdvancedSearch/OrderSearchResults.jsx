import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrderSearchResults = connect(
  {
    advancedOrderSearchHelper: state.advancedOrderSearchHelper,
    pageSize: state.constants.CASE_SEARCH_PAGE_SIZE,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
  },
  function OrderSearchResults({
    advancedOrderSearchHelper,
    pageSize,
    showMoreResultsSequence,
  }) {
    return (
      <>
        {advancedOrderSearchHelper.showSearchResults && (
          <>
            <h1 className="margin-top-4">
              ({advancedOrderSearchHelper.searchResultsCount}) Results
            </h1>

            <table className="usa-table search-results docket-record responsive-table row-border-only">
              <thead>
                <tr>
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
                      <td>
                        <a href={`/case-detail/${result.docketNumber}`}>
                          {result.docketNumberWithSuffix}
                        </a>
                      </td>
                      <td>{result.caseTitle}</td>
                      <td>{result.documentTitle}</td>
                      <td>{result.formattedFiledDate}</td>
                      <td>{result.signedJudgeName}</td>
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
