import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const TodaysOpinions = connect(
  {
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    todaysOpinionsHelper: state.todaysOpinionsHelper,
  },
  function TodaysOpinions({
    openCaseDocumentDownloadUrlSequence,
    todaysOpinionsHelper,
  }) {
    return (
      <>
        <BigHeader text="Today’s Opinions" />

        <section className="usa-section grid-container todays-opinions">
          <h1>{todaysOpinionsHelper.formattedCurrentDate}</h1>

          {todaysOpinionsHelper.formattedOpinions.length === 0 && (
            <h3 className="maxw-tablet">
              Opinions are generally published at 3:00 PM. If you are receiving
              this message after 3:00 PM, there are no opinions today.
            </h3>
          )}

          {todaysOpinionsHelper.formattedOpinions.length > 0 && (
            <table
              aria-label="todays opinions"
              className="usa-table gray-header todays-opinions responsive-table row-border-only"
            >
              <thead>
                <tr>
                  <th aria-hidden="true" />
                  <th aria-hidden="true" />
                  <th aria-label="Docket Number">Docket No.</th>
                  <th>Case Title</th>
                  <th>Opinion Type</th>
                  <th>Pages</th>
                  <th>Date</th>
                  <th>Judge</th>
                </tr>
              </thead>
              <tbody>
                {todaysOpinionsHelper.formattedOpinions.map((opinion, idx) => (
                  <tr key={`opinion-row-${opinion.docketEntryId}`}>
                    <td className="center-column">{idx + 1}</td>
                    <td aria-hidden="true"></td>
                    <td>
                      <CaseLink formattedCase={opinion} />
                    </td>
                    <td>{opinion.caseCaption}</td>
                    <td>
                      <Button
                        link
                        aria-label={`View PDF: ${opinion.descriptionDisplay}`}
                        className="text-left line-height-standard padding-0"
                        onClick={() => {
                          openCaseDocumentDownloadUrlSequence({
                            docketEntryId: opinion.docketEntryId,
                            docketNumber: opinion.docketNumber,
                            isPublic: true,
                            useSameTab: true,
                          });
                        }}
                      >
                        {opinion.documentType}
                      </Button>
                    </td>
                    <td>{opinion.numberOfPagesFormatted}</td>
                    <td>{opinion.formattedFilingDate}</td>
                    <td>{opinion.formattedJudgeName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </>
    );
  },
);
