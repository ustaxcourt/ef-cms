import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SearchResults = connect(
  {
    advancedSearchHelper: state.advancedSearchHelper,
    pageSize: state.constants.CASE_SEARCH_PAGE_SIZE,
    showMoreResultsSequence: sequences.showMoreResultsSequence,
  },
  ({ advancedSearchHelper, pageSize, showMoreResultsSequence }) => {
    return (
      <>
        {advancedSearchHelper.showSearchResults && (
          <>
            <h1 className="margin-top-4">
              ({advancedSearchHelper.searchResultsCount}) Results
            </h1>

            <table className="usa-table search-results docket-record responsive-table row-border-only">
              <thead>
                <tr>
                  <th aria-label="Number"></th>
                  <NonMobile>
                    <th>Petitioner(s)</th>
                  </NonMobile>
                  <th>Docket</th>
                  <NonMobile>
                    <th>Date filed</th>
                    <th>Case name</th>
                    <th>State</th>
                  </NonMobile>
                  <Mobile>
                    <th>Case name</th>
                  </Mobile>
                </tr>
              </thead>
              <tbody>
                {advancedSearchHelper.formattedSearchResults.map(
                  (result, idx) => (
                    <tr className="search-result" key={idx}>
                      <td className="center-column">{idx + 1}</td>
                      <NonMobile>
                        <td>
                          {result.contactPrimaryName}
                          {result.contactSecondaryName && (
                            <>
                              <br />
                              {result.contactSecondaryName}
                            </>
                          )}
                        </td>
                      </NonMobile>
                      <td>
                        <CaseLink formattedCase={result} />
                      </td>
                      <NonMobile>
                        <td>{result.formattedFiledDate}</td>
                        <td>{result.caseCaptionNames}</td>
                        <td>
                          {result.fullStateNamePrimary}
                          {result.fullStateNameSecondary && (
                            <>
                              <br />
                              {result.fullStateNameSecondary}
                            </>
                          )}
                        </td>
                      </NonMobile>
                      <Mobile>
                        <td>
                          <div>{result.caseCaptionNames}</div>
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
            Load {pageSize} More
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
