import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React from 'react';

const MailPayment = () => (
  <div className="tablet:grid-col-12">
    <h3>Mail in payment</h3>
    <p>Make checks/money order payable to:</p>
    <address>
      Clerk, United States Tax Court
      <br />
      400 2nd St NW
      <br />
      Washington, DC 20217
    </address>
  </div>
);

export const ActionRequired = connect(
  {
    showDetails: state.paymentInfo.showDetails,
    togglePaymentDetailsSequence: sequences.togglePaymentDetailsSequence,
  },
  function ActionRequired({ showDetails, togglePaymentDetailsSequence }) {
    return (
      <ul className="usa-accordion">
        <li>
          <button
            aria-controls="paymentInfo"
            aria-expanded={showDetails}
            className="usa-accordion__button"
            id="actions-button"
            onClick={() => togglePaymentDetailsSequence()}
          >
            <span>
              <FontAwesomeIcon className="action-flag" icon="flag" size="sm" />{' '}
              Pay $60.00 Filing Fee
            </span>
          </button>
          {showDetails && (
            <div
              aria-hidden="false"
              className="usa-accordion-content grid-container padding-x-0 margin-top-3"
              id="paymentInfo"
            >
              <div className="grid-row">
                <div className="tablet:grid-col-6">
                  <h2>Pay by Debit / Credit Card</h2>
                  <p>Copy your docket number(s) and pay online.</p>
                  <Button
                    aria-label="pay.gov u.s. tax court filing fees"
                    className="tablet-full-width margin-bottom-3"
                    href="https://pay.gov/public/form/start/60485840"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Pay Now
                  </Button>
                </div>
                <div className="tablet:grid-col-6">
                  <Hint>
                    It may take up to X days for your payment to appear online.
                  </Hint>

                  <section className="only-small-screens">
                    <div className="margin-top-3 margin-bottom-neg-2">
                      <MailPayment />
                    </div>
                  </section>

                  <div className="margin-top-5">
                    <h3>Canʼt afford to pay the fee?</h3>
                    <p>
                      You may be eligible for a filing fee waiver.{' '}
                      <a
                        aria-label="View download application pdf"
                        href="https://www.ustaxcourt.gov/forms/Application_for_Waiver_of_Filing_Fee.pdf"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        File an application
                      </a>{' '}
                      to request a waiver.
                    </p>
                  </div>
                </div>
              </div>
              <section className="only-large-screens margin-top-neg-3">
                <div className="grid-row">
                  <MailPayment />
                </div>
              </section>
            </div>
          )}
        </li>
      </ul>
    );
  },
);
