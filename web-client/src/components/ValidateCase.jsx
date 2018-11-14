import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import moment from 'moment';
import React from 'react';

/**
 *
 */
export default connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    user: state.user,
    updateCase: sequences.updateCase,
    toggleDocumentValidation: sequences.toggleDocumentValidation,
  },
  function CaseDetail({
    baseUrl,
    caseDetail,
    user,
    updateCase,
    toggleDocumentValidation,
  }) {
    return (
      <section className="usa-section usa-grid">
        <a href="/">Back to Petitions Section Work Queue</a>
        <h6>Case status {caseDetail.status}</h6>
        <h1 tabIndex="-1">Docket number: {caseDetail.docketNumber}</h1>
        <button onClick={() => updateCase()}>Save updates</button>
        <p>
          {user.name}, Petitioner v. Commissioner of Internal Revenue,
          Respondent
        </p>
        <br />
        <h2>Case Activity Record</h2>
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Date filled</th>
              <th>Filings and proceedings</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
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
                      baseUrl +
                      '/documents/' +
                      item.documentId +
                      '/downloadPolicy'
                    }
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon="file-pdf" />
                    {item.documentType}
                  </a>
                </td>
                <td>
                  <input
                    id={item.documentId}
                    type="checkbox"
                    name={'validate-' + item.documentType}
                    onChange={() => toggleDocumentValidation({ item })}
                    checked={!!item.validated}
                  />
                  <label htmlFor={item.documentId}>Validate</label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  },
);
