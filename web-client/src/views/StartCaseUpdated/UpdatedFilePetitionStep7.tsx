import {
  Accordion,
  AccordionItem,
} from '@web-client/ustc-ui/Accordion/Accordion';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import React from 'react';

export function UpdatedFilePetitionStep7() {
  return (
    <>
      <SuccessNotification isDismissible={false} />
      <div className="petitioner-flow-text">
        Once the Petition is processed by the Court, you will be able to check
        the status of your case, submit new documents and view activity on the
        case on the docket record.
      </div>
      <h3 style={{ marginTop: '20px' }}>Pay $60 filing fee</h3>
      <div className="petitioner-flow-text">
        Pay by credit/debit card, Amazon, PayPal or ACH (bank account) online.
        You’ll need your docket number.
      </div>
      <div className="petitioner-flow-text" style={{ marginTop: '3px' }}>
        Your case’s filing fee status may take 24-48 hours from payment date to
        update in your case.
      </div>

      <Button
        href="https://www.pay.gov/public/form/start/60485840"
        rel="noopener noreferrer"
        style={{ marginTop: '20px' }}
        target="_blank"
      >
        Pay Now Online
      </Button>

      <div className="grid-row grid-gap margin-top-20">
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
            <div>
              <div style={{ marginBottom: '5px' }}>
                Make checks/money orders payable to:{' '}
              </div>
              <div>Clerk, United States Tax Court</div>
              <div>400 Second Street, NW </div>
              <div>Washington, DC 20217 </div>
              <div style={{ marginTop: '8px' }}>
                {`On the memo line of the check or money order, write "filing
                  fee" and your docket number.`}
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
            <div>
              <span>Submit an </span>
              <Button
                link
                className="usa-link--external text-left mobile-text-wrap"
                href="https://www.ustaxcourt.gov/resources/forms/Application_for_Waiver_of_Filing_Fee.pdf"
                iconColor="blue"
                overrideMargin="margin-right-1"
                rel="noopener noreferrer"
                target="_blank"
              >
                Application for Waiver of Filing Fee.
              </Button>
              <span>
                This form requires detailed information and must be signed under
                penalty of perjury.
              </span>
              <ol style={{ marginTop: '5px', paddingLeft: '25px' }}>
                <li>Download and fill in the form.</li>
                <li>
                  Print the completed form or save a PDF of the form to your
                  computer/device.
                </li>
                <li>
                  File the form to your case:
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li>
                      You may electronically file the form after your Petition
                      has been processed by the Court.
                    </li>
                    <li>
                      <div>You may mail or bring the form to:</div>
                      <div style={{ marginTop: '3px' }}>
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

      <Button secondary href="/" style={{ marginTop: '20px' }}>
        Go to My Cases
      </Button>
    </>
  );
}
