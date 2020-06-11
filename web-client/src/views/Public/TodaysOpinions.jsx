import { BigHeader } from '../BigHeader';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TodaysOpinions = connect(
  {
    todaysOpinions: state.todaysOpinions,
  },
  function TodaysOpinions({ todaysOpinions }) {
    return (
      <>
        <BigHeader text="Today’s Opinions" />

        <section className="usa-section grid-container todays-opinions">
          <h1>December 23, 2018</h1>

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
              {todaysOpinions.map((opinion, idx) => (
                <tr key={idx}>
                  <td className="center-column">{idx + 1}</td>
                  <td aria-hidden="true"></td>
                  <td>{opinion.docketNumberWithSuffix}</td>
                  <td>{opinion.caseCaption}</td>
                  <td>{opinion.documentType}</td>
                  <td>{opinion.numberOfPages}</td>
                  <td>{opinion.filingDate}</td>
                  <td>{opinion.judge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </>
    );
  },
);
