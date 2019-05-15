import { CaseInformationPublic } from './CaseInformationPublic';
import { DocketRecord } from './DocketRecord/DocketRecord';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../ustc-ui/Hint/Hint';
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
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <h1 className="captioned" tabIndex="-1">
                  Docket Number: {caseDetail.docketNumberWithSuffix}
                </h1>
                <p className="margin-0">{caseDetail.caseTitle}</p>
              </div>
              <div className="tablet:grid-col-6">
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
        </div>
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          {caseHelper.showActionRequired && (
            <div className="subsection">
              <div className="title">
                <h1>Action Required</h1>
              </div>
              <ul className="usa-accordion">
                <li>
                  <button
                    className="usa-accordion__button font-normal"
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
                      Pay $60.00 Filing Fee
                    </span>
                  </button>
                  {showDetails && (
                    <div
                      id="paymentInfo"
                      className="usa-accordion-content grid-container padding-x-0 padding-y-205"
                      aria-hidden="false"
                    >
                      <div className="grid-row">
                        <div className="tablet:grid-col-6">
                          <h3>Pay by Debit / Credit Card</h3>
                          <p>Copy your docket number(s) and pay online.</p>
                          <a
                            className="usa-button"
                            href="https://pay.gov/public/form/start/60485840"
                            aria-label="pay.gov u.s. tax court filing fees"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Pay now
                          </a>

                          <h3 className="margin-top-1">Mail in payment</h3>
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
                        <div className="tablet:grid-col-6">
                          <div className="margin-bottom-8 margin-top-2">
                            <Hint>
                              It may take up to X days for your payment to
                              appear online.
                            </Hint>
                          </div>

                          <h3>Canʼt afford to pay the fee?</h3>
                          <p>
                            You may be eligible for a filing fee waiver.{' '}
                            <a
                              href="https://www.ustaxcourt.gov/forms/Application_for_Waiver_of_Filing_Fee.pdf"
                              aria-label="View download application pdf"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              File an application
                            </a>{' '}
                            to request a waiver.
                          </p>
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
