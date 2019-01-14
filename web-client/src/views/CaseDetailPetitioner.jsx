import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import moment from 'moment';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import SuccessNotification from './SuccessNotification';
import PartyInformation from './PartyInformation';

export default connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.formattedCaseDetail,
    currentTab: state.currentTab,
    helper: state.caseDetailHelper,
    showDetails: state.paymentInfo.showDetails,
    togglePaymentDetailsSequence: sequences.togglePaymentDetailsSequence,
    updateCurrentTabSequence: sequences.updateCurrentTabSequence,
  },
  function CaseDetail({
    baseUrl,
    caseDetail,
    currentTab,
    helper,
    showDetails,
    togglePaymentDetailsSequence,
    updateCurrentTabSequence,
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
          <h1 className="captioned" tabIndex="-1">
            Docket number: {caseDetail.docketNumber}
          </h1>
          <p>
            {caseDetail.petitioners[0].name} Petitioner v. Commissioner of
            Internal Revenue, Respondent
          </p>
          <hr aria-hidden="true" />
          <SuccessNotification />
          <ErrorNotification />
          {!caseDetail.payGovId && (
            <div className="subsection">
              <h2>Action Required</h2>
              <ul className="usa-accordion">
                <li>
                  <button
                    className="usa-accordion-button"
                    aria-expanded={showDetails}
                    aria-controls="paymentInfo"
                    id="actions-button"
                    onClick={() => togglePaymentDetailsSequence()}
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
            </div>
          )}
          <nav className="horizontal-tabs subsection">
            <ul role="tabslist">
              <li
                role="presentation"
                className={currentTab == 'Docket Record' ? 'active' : ''}
              >
                <button
                  role="tab"
                  className="tab-link"
                  id="tab-docket-record"
                  aria-selected={currentTab === 'Docket Record'}
                  onClick={() =>
                    updateCurrentTabSequence({ value: 'Docket Record' })
                  }
                >
                  Docket Record
                </button>
              </li>
              <li className={currentTab == 'Case Information' ? 'active' : ''}>
                <button
                  role="tab"
                  className="tab-link"
                  id="tab-case-info"
                  aria-selected={currentTab === 'Case Information'}
                  onClick={() =>
                    updateCurrentTabSequence({ value: 'Case Information' })
                  }
                >
                  Case Information
                </button>
              </li>
            </ul>
          </nav>
          {currentTab == 'Case Information' && (
            <div className="tab-content" role="tabpanel">
              <PartyInformation />
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
                  {caseDetail.documents.map((document, idx) => (
                    <tr key={idx}>
                      <td className="responsive-title">
                        <span className="responsive-label">Activity date</span>
                        {moment(document.createdAt).format('l')}
                      </td>
                      <td>
                        <span className="responsive-label">Title</span>
                        <a
                          href={`${baseUrl}/documents/${
                            document.documentId
                          }/documentDownloadUrl`}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label="View PDF"
                        >
                          <FontAwesomeIcon icon="file-pdf" />
                          {document.documentType}
                        </a>
                      </td>
                      <td>
                        <span className="responsive-label">Filed by</span>
                        {document.filedBy}
                      </td>
                      <td>
                        <span className="responsive-label">Status</span>
                        {document.isStatusServed && (
                          <span>
                            R served on {moment(caseDetail.irsDate).format('L')}
                          </span>
                        )}
                        {!caseDetail.irsSendDate && (
                          <span>{document.status}</span>
                        )}
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
                  {helper.showPreferredTrialCity && (
                    <tr>
                      <td>{caseDetail.createdAtFormatted}</td>
                      <td>
                        Request for Place of Trial at{' '}
                        {caseDetail.preferredTrialCity}
                      </td>
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
