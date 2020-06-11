import { BigHeader } from '../BigHeader';
import { connect } from '@cerebral/react';
import React from 'react';

export const TodaysOpinions = connect({}, function TodaysOpinions() {
  return (
    <>
      <BigHeader text="Today’s Opinions" />

      <section className="usa-section grid-container todays-opinions">
        <h1>December 23, 2018</h1>

        <table
          aria-label="docket record"
          className="usa-table case-detail docket-record responsive-table row-border-only"
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
            <tr>
              {/* <td className="center-column hide-on-mobile">{entry.index}</td> */}
              <td className="center-column">1</td>
              <td aria-hidden="true"></td>
              <td>107-20</td>
              <td>Ramona Ravenclaw, Petitioner</td>
              <td>T.C. Opinion</td>
              {/* <td className="hide-on-mobile number-of-pages">
                {entry.numberOfPages}
              </td> */}
              <td>3</td>
              <td>12/23/2018</td>
              <td>Judge Armen</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
});
