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
    updateCase: sequences.updateCase,
    toggleDocumentValidation: sequences.toggleDocumentValidation,
  },
  function CaseDetail({
    baseUrl,
    caseDetail,
    updateCase,
    toggleDocumentValidation,
    updatePreviewUrl,
  }) {
    return (
      <React.Fragment>
        <div className="usa-grid">
          <a href="/">Back to Petitions Section Work Queue</a>
        </div>
        <section className="usa-section usa-grid">
          <p>
            Case status <span className="usa-label">{caseDetail.status}</span>
          </p>
          <div className="usa-grid-full">
            <div className="usa-width-two-thirds">
              <h1 tabIndex="-1">Docket number: {caseDetail.docketNumber}</h1>
            </div>
            <div className="usa-width-one-third">
              <button
                className="float-right"
                id="update-case"
                onClick={() => updateCase()}
              >
                Save updates
              </button>
            </div>
          </div>

          <p>
            {caseDetail.userId}, Petitioner v. Commissioner of Internal Revenue,
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
                      aria-label="View PDF"
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
      </React.Fragment>
    );
  },
);
