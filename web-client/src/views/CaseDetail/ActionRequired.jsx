import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React from 'react';

export const ActionRequired = connect(
  {
    caseDetail: state.formattedCaseDetail,
    caseHelper: state.caseDetailHelper,
    setDocumentDetailTabSequence: sequences.setDocumentDetailTabSequence,
    showDetails: state.paymentInfo.showDetails,
    togglePaymentDetailsSequence: sequences.togglePaymentDetailsSequence,
  },
  function ActionRequired({ showDetails, togglePaymentDetailsSequence }) {
    return (
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
              <FontAwesomeIcon icon="flag" className="action-flag" size="sm" />{' '}
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
                  <h2>Pay by Debit / Credit Card</h2>
                  <p>Copy your docket number(s) and pay online.</p>
                  <a
                    className="usa-button"
                    href="https://pay.gov/public/form/start/60485840"
                    aria-label="pay.gov u.s. tax court filing fees"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pay Now
                  </a>
                </div>
                <div className="tablet:grid-col-6">
                  <Hint>
                    It may take up to X days for your payment to appear online.
                  </Hint>
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
              <div className="grid-row">
                <div className="tablet:grid-col-12 margin-bottom-2">
                  <h3 className="margin-top-2">Mail in payment</h3>
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
    );
  },
);
