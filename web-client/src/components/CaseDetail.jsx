import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state } from 'cerebral';
import moment from 'moment';
import React from 'react';

/**
 *
 */
export default connect(
  {
    caseDetail: state.caseDetail,
    user: state.user,
  },
  function CaseDetail({ caseDetail, user }) {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Docket number: {caseDetail.docketNumber}</h1>
        <p>
          {user.name}, Petitioner v. Commissioner of Internal Revenue,
          Respondent
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
            {!caseDetail.documents.length && (
              <tr>
                <td colSpan="3">(none)</td>
              </tr>
            )}
            {caseDetail.documents.map((item, idx) => (
              <tr key={idx}>
                <td className="responsive-title">
                  <span className="responsive-label">Activity date</span>
                  {moment(item.createdAt).format('LLL')}
                </td>
                <td>
                  <span className="responsive-label">
                    Filings and proceedings
                  </span>
                  <a
                    className="pdf-link"
                    href={
                      'http://localhost:3000/v1/documents/' +
                      item.documentId +
                      '/downloadPolicy'
                    }
                  >
                    <FontAwesomeIcon icon="file-pdf" />
                    {item.documentType}
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
