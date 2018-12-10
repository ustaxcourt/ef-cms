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
    currentTab: state.currentTab,
    submitSendToIRS: sequences.submitToIRS,
    submitUpdateCase: sequences.submitUpdateCase,
    updateCaseValue: sequences.updateCaseValue,
    updateCurrentTab: sequences.updateCurrentTab,
    updateFormValue: sequences.updateFormValue,
    viewDocument: sequences.viewDocument,
  },
  function CaseDetail({
    caseDetail,
    currentTab,
    submitUpdateCase,
    submitSendToIRS,
    updateCaseValue,
    updateCurrentTab,
    updateFormValue,
    viewDocument,
  }) {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back to dashboard
          </a>
        </div>
        <section className="usa-section usa-grid">
          <h1 tabIndex="-1">Docket number: {caseDetail.docketNumber}</h1>
          <p>
            {caseDetail.userId} v. Commissioner of Internal Revenue, Respondent
          </p>
          <p>
            <span className="usa-label">{caseDetail.status}</span>
          </p>
          <hr />
          <SuccessNotification />
          <ErrorNotification />
          <nav className="horizontal-tabs">
            <ul role="tabslist">
              <li
                role="presentation"
                className={currentTab == 'Docket Record' ? 'active' : ''}
              >
                <button
                  role="tab"
                  className="tab-link"
                  onClick={() => updateCurrentTab({ value: 'Docket Record' })}
                >
                  Docket Record
                </button>
              </li>
              <li className={currentTab == 'Case Information' ? 'active' : ''}>
                <button
                  role="tab"
                  className="tab-link"
                  onClick={() =>
                    updateCurrentTab({ value: 'Case Information' })
                  }
                >
                  Case Information
                </button>
              </li>
            </ul>
          </nav>
          {currentTab == 'Docket Record' && (
            <div className="tab-content" role="tabpanel">
              <button>
                <FontAwesomeIcon icon="cloud-upload-alt" /> File Document
              </button>
              <button id="send-to-irs" onClick={() => submitSendToIRS()}>
                Send to IRS
              </button>
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Date filed</th>
                    <th>Title</th>
                    <th>Filed by</th>
                    <th>Status</th>
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
                    </tr>
                  ))}
                  {caseDetail.showPaymentRecord && (
                    <tr>
                      <td>{caseDetail.payGovDateFormatted}</td>
                      <td>Filing fee paid</td>
                      <td />
                      <td />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {currentTab == 'Case Information' && (
            <div className="tab-content" role="tabpanel">
              <fieldset className="usa-fieldset-inputs usa-sans">
                <legend>Petition fee</legend>
                {caseDetail.showPaymentRecord && (
                  <React.Fragment>
                    <p className="label">Paid by pay.gov</p>
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
                          <button
                            id="update-case-page-end"
                            onClick={() => submitUpdateCase()}
                          >
                            Save updates
                          </button>
                        </React.Fragment>
                      )}
                    </li>
                  </ul>
                )}
              </fieldset>
            </div>
          )}
        </section>
      </React.Fragment>
    );
  },
);
