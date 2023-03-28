import { BigHeader } from '../BigHeader';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const OpinionPamphlets = connect(
  {
    opinionPamphletsHelper: state.opinionPamphletsHelper,
  },
  function OpinionPamphlets({ opinionPamphletsHelper }) {
    return (
      <>
        <BigHeader text="United States Tax Court Reports" />

        <section className="usa-section grid-container opinion-pamphlets">
          {opinionPamphletsHelper.pamphletPeriods.map(period => {
            return (
              <div className="margin-bottom-1" key={period}>
                <h2>{period}</h2>
                <p>
                  <a href="/">link goes here!</a>
                </p>
                <table
                  aria-label="docket record"
                  className="usa-table case-detail ustc-table responsive-table"
                  id="docket-record-table"
                >
                  <thead>
                    <tr>
                      <th>Docket No.</th>
                      <th>Case</th>
                      <th>Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opinionPamphletsHelper.filingDateKeys.forEach(
                      filingDateKey => {
                        const show =
                          opinionPamphletsHelper.showPamphletsForYear({
                            filingDateKey,
                            year: period,
                          });

                        if (show) {
                          opinionPamphletsHelper.pamphletsByDate[
                            filingDateKey
                          ].map(pamphlet => {
                            const htmlStuff = (
                              <tr key={pamphlet.docketEntryId}>
                                <td>{pamphlet.docketNumber}</td>
                                <td>{pamphlet.caseCaption}</td>
                                {/* TODO: update this property during 9967 */}
                                <td>{pamphlet.pageCount}</td>
                              </tr>
                            );
                            console.log(htmlStuff);
                            // wtf???? htmlStuff is printing
                            return htmlStuff;
                          });
                        }
                      },
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}
        </section>
      </>
    );
  },
);

OpinionPamphlets.displayName = 'OpinionPamphlets';
