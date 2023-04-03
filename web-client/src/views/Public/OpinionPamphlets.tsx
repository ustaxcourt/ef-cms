import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
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
    return (
      <>
        <BigHeader text="United States Tax Court Reports" />

        <section className="usa-section grid-container opinion-pamphlets">
          {opinionPamphletsHelper.pamphletPeriods.map(period => {
            return (
              <div className="margin-bottom-1" key={period}>
                <h2>{period}</h2>
                {opinionPamphletsHelper.yearAndFilingDateMap[period].map(
                  filingDateKey => {
                    return (
                      <div className="grid-row grid-gap" key={filingDateKey}>
                        <div className="grid-col-4">
                          <Button
                            link
                            aria-label={`View PDF: ${opinionPamphletsHelper.pamphletsGroupedByFilingDate[filingDateKey][0].documentTitle}`}
                            className="margin-bottom-2 text-left line-height-standard padding-0"
                            target="_blank"
                            onClick={() => {
                              openCaseDocumentDownloadUrlSequence({
                                docketEntryId:
                                  opinionPamphletsHelper.getPamhpletToDisplay(
                                    filingDateKey,
                                  ).docketEntryId,
                                docketNumber:
                                  opinionPamphletsHelper.getPamhpletToDisplay(
                                    filingDateKey,
                                  ).docketNumber,
                                isPublic: true,
                                useSameTab: false,
                              });
                            }}
                          >
                            {
                              opinionPamphletsHelper.getPamhpletToDisplay(
                                filingDateKey,
                              ).documentTitle
                            }
                          </Button>
                        </div>
                        <div className="grid-col-6"></div>
                        <div className="grid-col-2 text-right">
                          <span className="text-bold">Filed:</span>{' '}
                          {
                            opinionPamphletsHelper.getPamhpletToDisplay(
                              filingDateKey,
                            ).formattedFilingDate
                          }
                        </div>
                        <table
                          aria-label="docket record"
                          className="usa-table case-detail ustc-table responsive-table"
                          id="docket-record-table"
                          key={filingDateKey}
                        >
                          <thead>
                            <tr>
                              <th className="width-card-lg">Docket No.</th>
                              <th>Case</th>
                              <th className="width-15 text-right">Page</th>
                            </tr>
                          </thead>
                          <tbody>
                            {opinionPamphletsHelper.pamphletsGroupedByFilingDate[
                              filingDateKey
                            ].map(pamphlet => {
                              return (
                                <tr key={pamphlet.docketEntryId}>
                                  <td className="width-card-lg">
                                    {pamphlet.docketNumber}
                                  </td>
                                  <td>{pamphlet.caseCaption}</td>
                                  {/* TODO: update this property with work done in 9967 */}
                                  <td className="width-15 text-right">
                                    {pamphlet.pageCount}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  },
                )}
              </div>
            );
          })}
        </section>
      </>
    );
  },
);

OpinionPamphlets.displayName = 'OpinionPamphlets';
