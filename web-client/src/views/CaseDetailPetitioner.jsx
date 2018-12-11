import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import moment from 'moment';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import openDocumentBlob from './openDocumentBlob';
import SuccessNotification from './SuccessNotification';

export default connect(
  {
    caseDetail: state.formattedCaseDetail,
    currentTab: state.currentTab,
    showDetails: state.paymentInfo.showDetails,
    togglePaymentDetails: sequences.togglePaymentDetails,
    updateCurrentTab: sequences.updateCurrentTab,
    user: state.user,
    viewDocument: sequences.viewDocument,
  },
  function CaseDetail({
    caseDetail,
    currentTab,
    showDetails,
    togglePaymentDetails,
    updateCurrentTab,
    user,
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
            {user.firstName} {user.lastName}, Petitioner v. Commissioner of
            Internal Revenue, Respondent
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
                  id="tab-docket-record"
                  onClick={() => updateCurrentTab({ value: 'Docket Record' })}
                >
                  Docket Record
                </button>
              </li>
              <li className={currentTab == 'Case Information' ? 'active' : ''}>
                <button
                  role="tab"
                  className="tab-link"
                  id="tab-case-info"
                  onClick={() =>
                    updateCurrentTab({ value: 'Case Information' })
                  }
                >
                  Case Information
                </button>
              </li>
            </ul>
          </nav>
          {currentTab == 'Case Information' && (
            <div className="tab-content" role="tabpanel">
              {!caseDetail.payGovId && (
                <ul className="usa-accordion">
                  <li>
                    <button
                      className="usa-accordion-button"
                      aria-expanded={showDetails}
                      aria-controls="paymentInfo"
                      id="actions-button"
                      onClick={() => togglePaymentDetails()}
                    >
                      <span>
                        <FontAwesomeIcon
                          icon="flag"
                          className="action-flag"
                          size="sm"
                        />{' '}
                        Pay $60.00 filing fee.
                      </span>
                    </button>
                    {showDetails && (
                      <div
                        id="paymentInfo"
                        className="usa-accordion-content usa-grid-full"
                        aria-hidden="false"
                      >
                        <div className="usa-width-one-half">
                          <h3>Pay by debit card/credit card.</h3>
                          <p>Copy your docket number(s) and pay online.</p>
                          <div id="paygov-link-container">
                            <a
                              className="usa-button"
                              href="https://pay.gov/public/form/start/60485840"
                              aria-label="pay.gov u.s. tax court filing fees"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Pay now
                            </a>
                          </div>
                          <p>
                            <i>
                              Note: it may take up to X days for your payment to
                              appear online.
                            </i>
                          </p>
                        </div>
                        <div className="usa-width-one-half">
                          <h4>Canʼt afford to pay the fee?</h4>
                          <p>
                            You may be eligible for a filing fee waiver. File an
                            application to request a waiver.
                          </p>
                          <p>
                            <a
                              href="https://www.ustaxcourt.gov/forms/Application_for_Waiver_of_Filing_Fee.pdf"
                              aria-label="View download application pdf"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download application
                            </a>
                          </p>
                          <h4>Mail in payment</h4>
                          <p>Make checks/money order payable to:</p>
                          <address>
                            Clerk, United States Tax Court
                            <br />
                            400 2nd St NW
                            <br />
                            Washington, DC 20217
                            <br />
                          </address>
                        </div>
                      </div>
                    )}
                  </li>
                </ul>
              )}
            </div>
          )}
          {currentTab == 'Docket Record' && (
            <div className="tab-content" role="tabpanel">
              <table className="responsive-table" id="docket-record">
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
                        <button
                          className="pdf-link"
                          aria-label="View PDF"
                          onClick={() => {
                            viewDocument({
                              documentId: item.documentId,
                              callback: openDocumentBlob,
                            });
                          }}
                        >
                          <FontAwesomeIcon icon="file-pdf" />
                          {item.documentType}
                        </button>
                      </td>
                      <td>
                        <span className="responsive-label">Filed by</span>
                        {document.userId}
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
                      <td />
                    </tr>
                  ))}
                  {caseDetail.payGovId && (
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
            </div>
          )}
        </section>
      </React.Fragment>
    );
  },
);
