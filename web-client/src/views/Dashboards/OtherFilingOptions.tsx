import { Accordion, AccordionItem } from '../../ustc-ui/Accordion/Accordion';
import React from 'react';

export const OtherFilingOptions = function () {
  return (
    <div className="card">
      <div className="content-wrapper gray">
        <h3>Other Ways to File a Case</h3>

        <Accordion gray headingLevel="3">
          <AccordionItem
            customClassName="other-filing-option other-filing-option-mail"
            data-testid="other-filing-option-mail"
            key={'other-filing-option-mail accordion-icon'}
            title={'To file by mail:'}
          >
            <hr />
            Send required forms and filing fee to:
            <br />
            United States Tax Court
            <br />
            400 Second Street, NW
            <br />
            Washington, DC 20217
          </AccordionItem>
          <AccordionItem
            customClassName="other-filing-option other-filing-option-in-person"
            key={'other-filing-option-in-person accordion-icon'}
            title={'To file in person:'}
          >
            <hr />
            Please bring your forms and filing fee to:
            <br />
            United States Tax Court
            <br />
            400 Second Street, NW
            <br />
            Washington, DC 20217
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

OtherFilingOptions.displayName = 'OtherFilingOptions';
