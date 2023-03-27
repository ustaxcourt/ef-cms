import { BigHeader } from '../BigHeader';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OpinionPamphlets = connect(
  {
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    opinionPamphletsHelper: state.opinionPamphletsHelper,
  },
  function OpinionPamphlets({
    openCaseDocumentDownloadUrlSequence,
    opinionPamphletsHelper,
  }) {
    {
      console.log(opinionPamphletsHelper);
    }
    return (
      <>
        <BigHeader text="United States Tax Court Reports" />

        <section className="usa-section grid-container opinion-pamphlets">
          {opinionPamphletsHelper.pamphletPeriods.map(period => {
            Object.keys(opinionPamphletsHelper.pamphletsByDate).forEach(
              (k, v) => {
                if (k.split('-')[0].toString() === period) {
                  return (
                    <>
                      <div key={period}>
                        <h2>{period}</h2>
                        <p>link</p>
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
                            <tr>
                              <td>{v.docketNumber}</td>
                              <td>{v.caseCaption}</td>
                              <td>{v.pageCount}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  );
                }
              },
            );
          })}
        </section>
      </>
    );
  },
);

OpinionPamphlets.displayName = 'OpinionPamphlets';
