import { connect } from '@cerebral/react';
import React from 'react';
import { state } from 'cerebral';

/**
 * Footer
 */
export default connect(
  {
    caseDetail: state.caseDetail,
    docketNumber: state.docketNumber,
  },
  function CaseDetail({ docketNumber, caseDetail }) {
    return (
      <section className="usa-section usa-grid">
        <h1>Docket number: {docketNumber}</h1>
        <p>
          {caseDetail.petitionerName}, Petitioner v. Commissioner of Internal
          Revenue Service, Respondent
        </p>
        <h2>Required actions</h2>
        <p>
          Pay petition filing fee, Deadline: November 7, 2018,{' '}
          <button>Pay Fee</button>
        </p>
        <h2>Case activities</h2>
        <table>
          <thead>
            <tr>
              <th>Date submitted</th>
              <th>Filings and proceedings</th>
              <th>Date served</th>
            </tr>
          </thead>
          <tbody>
            {!caseDetail.activities.length && (
              <tr>
                <td colSpan="3">(none)</td>
              </tr>
            )}
            {caseDetail.activities.map((item, idx) => (
              <tr key={idx}>
                <td>{item.dateSubmitted}</td>
                <td>{item.filingsAndProceedings}</td>
                <td>{item.dateServed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  },
);
