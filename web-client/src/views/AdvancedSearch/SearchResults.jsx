import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SearchResults = connect(
  {
    searchResults: state.searchResults,
  },
  ({ searchResults }) => {
    return (
      <>
        {searchResults && searchResults.length > 0 && (
          <>
            <h1 className="margin-top-4">({searchResults.length}) Matches</h1>

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
                {searchResults.map((result, idx) => (
                  <tr key={idx}>
                    <td className="center-column">{idx + 1}</td>
                    <td>{result.contactPrimary.name}</td>
                    <td>
                      {result.docketNumber}
                      {result.docketNumberSuffix}
                    </td>
                    <td>{result.filedDate}</td>
                    <td>{result.caseCaption}</td>
                    <td>{result.contactPrimary.state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {searchResults && searchResults.length === 0 && (
          <>
            <h1 className="margin-top-4">No Matches Found</h1>
            <p>Check your search terms and try again.</p>
          </>
        )}
      </>
    );
  },
);
