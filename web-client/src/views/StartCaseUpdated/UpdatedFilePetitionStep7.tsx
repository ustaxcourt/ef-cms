import {
  Accordion,
  AccordionItem,
} from '@web-client/ustc-ui/Accordion/Accordion';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { InlineLink } from '@web-client/ustc-ui/InlineLink/InlineLink';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';

import React from 'react';

export const UpdatedFilePetitionStep7 = connect(
  {
    updatedFilePetitionHelper: state.updatedFilePetitionHelper,
  },
  function UpdatedFilePetitionStep7({ updatedFilePetitionHelper }) {
    const { isPetitioner } = updatedFilePetitionHelper;

    return (
      <>
        <SuccessNotification isDismissible={false} />
        <div className="petitioner-flow-text">
          Once the Petition is processed by the Court, you will be able to
          submit documents.
        </div>
        <h3 className="margin-top-205">Pay $60 filing fee</h3>
        <div className="petitioner-flow-text">
          {`Pay by credit/debit card, Amazon Pay, PayPal or ACH (bank account)
          online. You’ll need ${isPetitioner ? 'your' : 'the'} docket number.`}
        </div>
        <div className="petitioner-flow-text margin-top-1">
          {`${isPetitioner ? 'Your' : 'The'} case’s filing fee status may take 2-3 business days from payment
          date to update.`}
        </div>

        <Button
          className="margin-top-205"
          href="https://www.pay.gov/public/form/start/60485840"
          rel="noopener noreferrer"
          target="_blank"
        >
          Pay Now Online
        </Button>

        <div className="grid-row grid-gap margin-top-205" role="list">
          <Accordion
            className="petitioner-accordion-title"
            headingLevel="3"
            role="listitem"
          >
            <AccordionItem
              customTitleClassName="petitioner-accordion-title"
              key="Mail-in payment"
              title="Mail-in payment"
            >
              <div className="line-height-2">
                <div className="margin-bottom-1">
                  Make checks/money orders payable to:{' '}
                </div>
                <div>Clerk, United States Tax Court</div>
                <div>400 Second Street, NW </div>
                <div>Washington, DC 20217 </div>
                <div className="margin-top-1">
                  {`On the memo line of the check or money order, write "filing
                    fee" and ${isPetitioner ? 'your' : 'the'} docket number.`}
                </div>
              </div>
            </AccordionItem>
          </Accordion>
          <Accordion
            className="petitioner-accordion-title"
            headingLevel="3"
            role="listitem"
          >
            <AccordionItem
              customTitleClassName="petitioner-accordion-title"
              key="Can’t afford to pay the filing fee?"
              title="Can’t afford to pay the filing fee?"
            >
              <div className="line-height-2">
                <span>Submit an </span>
                <InlineLink href="https://www.ustaxcourt.gov/resources/forms/Application_for_Waiver_of_Filing_Fee.pdf">
                  Application for Waiver of Filing Fee.
                </InlineLink>
                <span>
                  This form requires detailed financial information and must be
                  signed under penalty of perjury.
                </span>
                <ol className="margin-top-1 padding-left-4">
                  <li>Download and fill in the form.</li>
                  <li>
                    Print the completed form or save a PDF of the form to your
                    computer/device.
                  </li>
                  <li>
                    File the form:
                    <ul className="list-style-disc padding-left-4">
                      <li>
                        {`You may electronically file the form after ${isPetitioner ? 'your' : 'the'} Petition
                        has been processed by the Court.`}
                      </li>
                      <li>
                        <div>You may mail or bring the form to:</div>
                        <div className="margin-top-1">
                          Clerk, United States Tax Court
                        </div>
                        <div>400 Second Street, NW</div>
                        <div>Washington, DC 20217</div>
                      </li>
                    </ul>
                  </li>
                </ol>{' '}
              </div>
            </AccordionItem>
          </Accordion>
        </div>

        <Button
          secondary
          className="margin-top-205"
          data-testid="button-back-to-dashboard"
          href="/"
        >
          Go to My Cases
        </Button>
      </>
    );
  },
);
