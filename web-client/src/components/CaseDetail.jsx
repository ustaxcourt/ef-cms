import { connect } from '@cerebral/react';
import React from 'react';
import { state } from 'cerebral';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Footer
 */
export default connect(
  {
    caseDetail: state.caseDetail,
  },
  function CaseDetail({ caseDetail }) {
    return (
      <section className="usa-section usa-grid">
        <h1>Docket number: {caseDetail.docketNumber}</h1>
        <p>
          {caseDetail.petitionerName}, Petitioner v. Commissioner of Internal
          Revenue, Respondent
        </p>
        <br />
        <h2>Case activities</h2>
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Activity date</th>
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
                <td className="responsive-title">
                  <span className="responsive-label">Activity date</span>
                  {item.dateSubmitted}
                </td>
                <td>
                  <span className="responsive-label">
                    Filings and proceedings
                  </span>
                  <a className="pdf-link" href="/">
                    <FontAwesomeIcon icon="file-pdf" />
                    {item.filingsAndProceedings}
                  </a>
                </td>
                <td>{item.dateServed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  },
);
