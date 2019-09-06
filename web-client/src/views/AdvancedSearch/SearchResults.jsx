import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SearchResults = connect(
  {
    advancedSearchHelper: state.advancedSearchHelper,
  },
  ({ advancedSearchHelper }) => {
    return (
      <>
        {advancedSearchHelper.showSearchResults && (
          <>
            <h1 className="margin-top-4">
              ({advancedSearchHelper.searchResultsCount}) Matches
            </h1>

            <table className="usa-table search-results docket-record responsive-table row-border-only">
              <thead>
                <tr>
                  <th aria-label="Number"></th>
                  <th>Petitioner(s)</th>
                  <th>Docket</th>
                  <th>Date filed</th>
                  <th>Case name</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {advancedSearchHelper.formattedSearchResults.map(
                  (result, idx) => (
                    <tr key={idx}>
                      <td className="center-column">{idx + 1}</td>
                      <td>
                        {result.contactPrimaryName}
                        {result.contactSecondaryName && (
                          <>
                            <br />
                            {result.contactSecondaryName}
                          </>
                        )}
                      </td>
                      <td>{result.docketNumberWithSuffix}</td>
                      <td>{result.formattedFiledDate}</td>
                      <td>{result.caseCaptionNames}</td>
                      <td>{result.fullStateName}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </>
        )}
        {advancedSearchHelper.showNoMatches && (
          <>
            <h1 className="margin-top-4">No Matches Found</h1>
            <p>Check your search terms and try again.</p>
          </>
        )}
      </>
    );
  },
);
