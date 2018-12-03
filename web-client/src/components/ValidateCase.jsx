import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import moment from 'moment';
import React from 'react';

import SuccessNotification from './SuccessNotification';
import ErrorNotification from './ErrorNotification';

export default connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    form: state.form,
    submitUpdateCase: sequences.submitUpdateCase,
    submitSendToIRS: sequences.submitToIRS,
    toggleDocumentValidation: sequences.toggleDocumentValidation,
    updateCaseValue: sequences.updateCaseValue,
    updateFormValue: sequences.updateFormValue,
  },
  function CaseDetail({
    baseUrl,
    caseDetail,
    form,
    submitUpdateCase,
    submitSendToIRS,
    toggleDocumentValidation,
    updateCaseValue,
    updateFormValue,
  }) {
    return (
      <React.Fragment>
        <div className="usa-grid">
          <a href="/" id="queue-nav">
            Back to dashboard
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
              {caseDetail.payGovId && !form.paymentType && (
                <React.Fragment>
                  <p>Paid by pay.gov</p>
                  <p>{caseDetail.payGovId}</p>
                </React.Fragment>
              )}
              {!(caseDetail.payGovId && !form.paymentType) && (
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
                    {form.paymentType == 'payGov' && (
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
              {caseDetail.documents.map((item, idx) => (
                <tr key={idx}>
                  <td className="responsive-title">
                    <span className="responsive-label">Activity date</span>
                    {moment(item.createdAt).format('l')}
                  </td>
                  <td>
                    <span className="responsive-label">Title</span>
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
                    <span className="responsive-label">Filed by</span>
                    Petitioner
                  </td>
                  <td>
                    <span className="responsive-label">Status</span>
                    {caseDetail.irsSendDate && (
                      <span>
                        R served on {moment(caseDetail.irsDate).format('L')}
                      </span>
                    )}
                    {!caseDetail.irsSendDate && <span>{item.status}</span>}
                  </td>
                  <td>
                    {!item.reviewDate && (
                      <span>
                        <input
                          id={item.documentId}
                          type="checkbox"
                          name={'validate-' + item.documentType}
                          onChange={() => toggleDocumentValidation({ item })}
                          checked={!!item.validated}
                        />
                        <label htmlFor={item.documentId}>Validate</label>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {caseDetail.payGovId && !form.paymentType && (
                <tr>
                  <td>{moment(caseDetail.payGovDate).format('l')}</td>
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
                id="update-case"
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
