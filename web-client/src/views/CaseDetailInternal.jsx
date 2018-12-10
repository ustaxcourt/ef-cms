import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import React from 'react';

import SuccessNotification from './SuccessNotification';
import ErrorNotification from './ErrorNotification';
import openDocumentBlob from './openDocumentBlob';

export default connect(
  {
    caseDetail: state.formattedCaseDetail,
    submitUpdateCase: sequences.submitUpdateCase,
    submitSendToIRS: sequences.submitToIRS,
    toggleDocumentValidation: sequences.toggleDocumentValidation,
    updateCaseValue: sequences.updateCaseValue,
    updateFormValue: sequences.updateFormValue,
    viewDocument: sequences.viewDocument,
  },
  function CaseDetail({
    caseDetail,
    submitUpdateCase,
    submitSendToIRS,
    toggleDocumentValidation,
    updateCaseValue,
    updateFormValue,
    viewDocument,
  }) {
    return (
      <React.Fragment>
        <div className="usa-grid">
          <a href="/" id="queue-nav">
            <FontAwesomeIcon icon="caret-left" /> Back to dashboard
          </a>
        </div>
        <section className="usa-section usa-grid">
          <SuccessNotification />
          <ErrorNotification />
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
                onClick={() => submitUpdateCase()}
              >
                Save updates
              </button>
            </div>
          </div>
          <p className="subsection">
            {caseDetail.userId} v. Commissioner of Internal Revenue, Respondent
          </p>
          <br />
          <div className="subsection">
            <h2>Case Information</h2>
            <fieldset className="usa-fieldset-inputs usa-sans">
              <legend>Petition Fee</legend>
              {caseDetail.showPaymentRecord && (
                <React.Fragment>
                  <p>Paid by pay.gov</p>
                  <p>{caseDetail.payGovId}</p>
                </React.Fragment>
              )}
              {caseDetail.showPaymentOptions && (
                <ul className="usa-unstyled-list">
                  <li>
                    <input
                      id="paygov"
                      type="radio"
                      name="paymentType"
                      value="payGov"
                      onChange={e => {
                        updateFormValue({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                    <label htmlFor="paygov">Paid by pay.gov</label>
                    {caseDetail.showPayGovIdInput && (
                      <React.Fragment>
                        <label htmlFor="paygovid">Payment ID</label>
                        <input
                          id="paygovid"
                          type="text"
                          name="payGovId"
                          value={caseDetail.payGovId || ''}
                          onChange={e => {
                            updateCaseValue({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                      </React.Fragment>
                    )}
                  </li>
                </ul>
              )}
            </fieldset>
          </div>
          <h2>Docket Record</h2>
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Date filed</th>
                <th>Title</th>
                <th>Filed by</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {caseDetail.documents.map((document, idx) => (
                <tr key={idx}>
                  <td className="responsive-title">
                    <span className="responsive-label">Activity date</span>
                    {document.createdAtFormatted}
                  </td>
                  <td>
                    <span className="responsive-label">Title</span>
                    <button
                      className="pdf-link"
                      aria-label="View PDF"
                      onClick={() =>
                        viewDocument({
                          documentId: document.documentId,
                          callback: openDocumentBlob,
                        })
                      }
                    >
                      <FontAwesomeIcon icon="file-pdf" />
                      {document.documentType}
                    </button>
                  </td>
                  <td>
                    <span className="responsive-label">Filed by</span>
                    Petitioner
                  </td>
                  <td>
                    <span className="responsive-label">Status</span>
                    {caseDetail.showIrsServedDate && (
                      <span>{caseDetail.datePetitionSentToIrsMessage}</span>
                    )}
                    {caseDetail.showDocumentStatus && (
                      <span>{document.status}</span>
                    )}
                  </td>
                  <td>
                    {document.showValidationInput && (
                      <span>
                        <input
                          id={document.documentId}
                          type="checkbox"
                          name={'validate-' + document.documentType}
                          onChange={() =>
                            toggleDocumentValidation({ document })
                          }
                          checked={!!document.validated}
                        />
                        <label htmlFor={document.documentId}>Validate</label>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {caseDetail.showPaymentRecord && (
                <tr>
                  <td>{caseDetail.payGovDateFormatted}</td>
                  <td>Filing fee paid</td>
                  <td />
                  <td />
                  <td />
                </tr>
              )}
            </tbody>
          </table>
          <div
            className={
              caseDetail.status == 'General Docket'
                ? 'usa-grid-full hidden'
                : 'usa-grid-full'
            }
          >
            <div className="usa-width-full">
              <button
                className="float-right"
                id="update-case-page-end"
                onClick={() => submitUpdateCase()}
              >
                Save updates
              </button>
              <button
                className="float-right"
                id="send-to-irs"
                onClick={() => submitSendToIRS()}
              >
                Send to IRS
              </button>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
