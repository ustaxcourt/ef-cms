import { BigHeader } from '../BigHeader';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TodaysOpinions = connect(
  {
    todaysOpinionsHelper: state.todaysOpinionsHelper,
  },
  function TodaysOpinions({ todaysOpinionsHelper }) {
    return (
      <>
        <BigHeader text="Today’s Opinions" />

        <section className="usa-section grid-container todays-opinions">
          <h1>{todaysOpinionsHelper.formattedCurrentDate}</h1>

          {(todaysOpinionsHelper.formattedOpinions.length === 0) &
          <p>There are no opinions today.</p>}

          {todaysOpinionsHelper.formattedOpinions.length > 0 && (
            <table
              aria-label="todays opinions"
              className="usa-table todays-opinions responsive-table row-border-only"
            >
              <thead>
                <tr>
                  <th aria-hidden="true" />
                  <th aria-hidden="true" />
                  <th>Docket Number</th>
                  <th>Case Title</th>
                  <th>Opinion Type</th>
                  <th>Pages</th>
                  <th>Date</th>
                  <th>Judge</th>
                </tr>
              </thead>
              <tbody>
                {todaysOpinionsHelper.formattedOpinions.map((opinion, idx) => (
                  <tr key={idx}>
                    <td className="center-column">{idx + 1}</td>
                    <td aria-hidden="true"></td>
                    <td>{opinion.docketNumberWithSuffix}</td>
                    <td>{opinion.caseCaption}</td>
                    <td>{opinion.formattedDocumentType}</td>
                    <td>{opinion.numberOfPages}</td>
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
