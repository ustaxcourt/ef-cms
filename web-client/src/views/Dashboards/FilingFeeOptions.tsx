import { Accordion, AccordionItem } from '../../ustc-ui/Accordion/Accordion';
import { Button } from '../../ustc-ui/Button/Button';
import React from 'react';

export const FilingFeeOptions = function () {
  return (
    <div className="card">
      <div className="content-wrapper gray">
        <h3>Filing Fee Options</h3>

        <p className="margin-bottom-2">
          To pay the filing fee, you must have an existing case. Your assigned
          docket number (e.g. 12345-67) is required to be input when paying the
          fee.
        </p>

        <hr />
        <p>
          <strong>Pay by debit/credit card</strong>
          <br />
          Copy your docket number(s) and pay online.
          <br />
          <Button
            className="margin-bottom-3 margin-top-2"
            href="https://pay.gov/public/form/start/60485840"
            id="pay_filing_fee"
            target="_blank"
          >
            Pay now
          </Button>
        </p>
        <hr />

        <Accordion gray headingLevel="3">
          <AccordionItem
            customClassName="payment-options"
            key={'other-options accordion-icon'}
            title={'Other options'}
          >
            <hr />
            <strong>Mail-in payment</strong>
            <br />
            Make checks/money orders payable to:
            <br />
            Clerk, United States Tax Court
            <br />
            400 Second Street, NW
            <br />
            Washington, DC 20217
            <br />
            <br />
            <strong>Can’t afford to pay the filing fee?</strong>
            <Button
              link
              className="usa-link--external text-left"
              href="https://www.ustaxcourt.gov/resources/forms/Application_for_Waiver_of_Filing_Fee.pdf"
              icon="file-pdf"
              iconColor="blue"
              rel="noopener noreferrer"
              shouldWrapText={true}
              target="_blank"
            >
              Download Application For Waiver of Filing Fee
            </Button>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

FilingFeeOptions.displayName = 'FilingFeeOptions';
