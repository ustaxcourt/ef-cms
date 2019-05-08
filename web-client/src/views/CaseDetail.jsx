import { CaseInformationPublic } from './CaseInformationPublic';
import { DocketRecord } from './DocketRecord';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PartyInformation } from './PartyInformation';
import { SuccessNotification } from './SuccessNotification';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetail = connect(
  {
    caseDetail: state.formattedCaseDetail,
    caseHelper: state.caseDetailHelper,
    showDetails: state.paymentInfo.showDetails,
    togglePaymentDetailsSequence: sequences.togglePaymentDetailsSequence,
  },
  function CaseDetail({
    caseDetail,
    caseHelper,
    showDetails,
    togglePaymentDetailsSequence,
  }) {
    return (
      <React.Fragment>
        <div className="breadcrumb grid-container">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back to dashboard
          </a>
        </div>
        <section className="usa-section grid-container">
          <div className="grid-container padding-x-0">
            <div className="grid-row">
              <div className="grid-col-6">
                <h1 className="captioned" tabIndex="-1">
                  Docket Number: {caseDetail.docketNumberWithSuffix}
                </h1>
                <p>{caseDetail.caseTitle}</p>
              </div>
              <div className="grid-col-6">
                {caseHelper.showRequestAccessToCaseButton && (
                  <a
                    className="usa-button tablet-full-width push-right"
                    href={`/case-detail/${
                      caseDetail.docketNumber
                    }/request-access`}
                    id="button-request-access"
                  >
                    Request Access to Case
                  </a>
                )}
              </div>
            </div>
          </div>

          <hr aria-hidden="true" />

          <SuccessNotification />
          <ErrorNotification />

          {caseHelper.showActionRequired && (
            <div className="subsection">
              <h2>Action Required</h2>
              <ul className="usa-accordion">
                <li>
                  <button
                    className="usa-accordion__button"
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
                      className="usa-accordion-content grid-container padding-x-0"
                      aria-hidden="false"
                    >
                      <div className="grid-row">
                        <div className="grid-col-6">
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
                        <div className="grid-col-6">
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
                    </div>
                  )}
                </li>
              </ul>
            </div>
          )}
          <Tabs className="classic-horizontal" bind="documentDetail.tab">
            <Tab
              tabName="docketRecord"
              title="Docket Record"
              id="tab-docket-record"
            >
              <DocketRecord />
            </Tab>
            <Tab tabName="caseInfo" title="Case Information" id="tab-case-info">
              {caseHelper.showCaseInformationPublic && (
                <CaseInformationPublic />
              )}
              <PartyInformation />
            </Tab>
          </Tabs>
        </section>
      </React.Fragment>
    );
  },
);
