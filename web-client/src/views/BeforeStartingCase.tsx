import {
  ALLOWLIST_FEATURE_FLAGS,
  ROLES,
} from '../../../shared/src/business/entities/EntityConstants';
import {
  Accordion,
  AccordionItem,
} from '@web-client/ustc-ui/Accordion/Accordion';
import { Button } from '../ustc-ui/Button/Button';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const BeforeStartingCase = connect(
  {
    closeModalAndReturnToDashboardSequence:
      sequences.closeModalAndReturnToDashboardSequence,
    petitionFlowUpdated:
      state.featureFlags[ALLOWLIST_FEATURE_FLAGS.UPDATED_PETITION_FLOW.key],
    showModal: state.modal.showModal,
    user: state.user,
  },
  function BeforeStartingCase({
    closeModalAndReturnToDashboardSequence,
    petitionFlowUpdated,
    user,
  }) {
    const redirectUrl =
      petitionFlowUpdated &&
      [ROLES.petitioner, ROLES.privatePractitioner].includes(user.role)
        ? '/file-a-petition/new'
        : '/file-a-petition/step-1';

    const isPetitioner = user.role === ROLES.petitioner;
    return (
      <>
        <style>
          {`
          @media print {
            #return-to-top-button {
              display: none !important;
            }
          }
        `}
        </style>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <h1 className="captioned" tabIndex={-1}>
                  Create a Case
                </h1>
              </div>
            </div>
          </div>
        </div>
        <section className="usa-section grid-container">
          <h2>How to Create a Case</h2>
          <WarningNotificationComponent
            alertWarning={{
              message:
                'Do not include personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers, birthdates, names of minor children, or financial account information) in your Petition or any other filing with the Court except in the Statement of Taxpayer Identification Number.',
            }}
            dismissible={false}
            scrollToTop={false}
          />
          <div className="petitioner-flow-text">
            Before starting a case, you can prepare forms and documents in
            advance.{' '}
            <b>
              {`Once you start this process, you won't be able to save your work and
              come back to it.`}
            </b>{' '}
            {`After the petition has been processed, you'll be able to log in at any
            time to view the status and take action in the case.`}
          </div>
          <div className="petitioner-flow-text">
            <span>
              <div className="petitioner-label">1. Complete the Petition</div>
              <div
                className="petitioner-flow-text"
                style={{ marginBottom: '5px' }}
              >
                This is the document that explains why you disagree with the
                Internal Revenue Service (IRS). There are{' '}
                {petitionFlowUpdated ? 'three' : 'two'} methods to file the
                Petition:
              </div>
              <ul className="margin-top-0">
                {petitionFlowUpdated && (
                  <li>
                    Answer some questions and have DAWSON create and file the
                    Petition.
                  </li>
                )}
                <li>
                  {
                    "Complete and upload for filing the Court's standard Petition form. "
                  }
                  <Button
                    link
                    className="usa-link--external text-left mobile-text-wrap margin-left-1"
                    href="https://www.ustaxcourt.gov/resources/forms/Petition_Simplified_Form_2.pdf"
                    icon="file-pdf"
                    iconColor="blue"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Petition form (T.C. Form 2)
                  </Button>
                </li>
                <li>
                  Upload for filing your own Petition that complies with the
                  requirements of the{' '}
                  <Button
                    link
                    className="usa-link--external text-left mobile-text-wrap"
                    href="https://www.ustaxcourt.gov/rules.html"
                    iconColor="blue"
                    overrideMargin="margin-right-1"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Tax Court Rules of Practice and Procedure.
                  </Button>
                </li>
              </ul>

              <div className="petitioner-label">2. Upload IRS Notice(s)</div>
              <div
                className="petitioner-flow-text"
                style={{ marginBottom: '5px' }}
              >
                {isPetitioner
                  ? 'If you received'
                  : 'If the petitioner received'}{' '}
                one or more Notices from the IRS:
              </div>
              <ul className="margin-top-0">
                <li>
                  Submit a PDF of the Notice(s) {isPetitioner ? 'you' : 'they'}{' '}
                  received.
                </li>
                <li>
                  Remove or block out (redact) Social Security Numbers (SSN),
                  Taxpayer Identification Numbers (TIN), or Employer
                  Identification Numbers (EIN) on a COPY of the IRS Notice(s) or
                  in a manner that does not permanently alter the original IRS
                  Notice(s).
                </li>
                <li>The Notice(s) will be part of the case record.</li>
              </ul>

              <div className="petitioner-label">3. Confirm your identity</div>
              <div className="petitioner-flow-text">
                <ul className="margin-top-0">
                  <li>
                    {`You'll be asked to complete and upload a Statement of
                    Taxpayer Identification Number (STIN) form. This document is
                    sent to the IRS to help them identify ${isPetitioner ? 'you' : 'the petitioner'}, but it's never
                    visible as part of the case record. This is the only
                    document that should contain ${isPetitioner ? 'your' : 'the petitioner’s'} SSN, TIN, or EIN.`}
                  </li>
                  <li>
                    {' '}
                    <Button
                      link
                      className="usa-link--external text-left mobile-text-wrap"
                      href="https://www.ustaxcourt.gov/resources/forms/Form_4_Statement_of_Taxpayer_Identification_Number.pdf"
                      iconColor="blue"
                      overrideMargin="margin-right-1"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Download the form
                    </Button>{' '}
                    and fill it out to submit it.
                  </li>
                </ul>
              </div>
              <div className="petitioner-label">4. Pay the $60 filing fee</div>
              <div className="petitioner-flow-text">
                <ul className="margin-top-0">
                  <li>
                    {`After you submit your case, you'll be asked to pay a $60
                    filing fee.`}
                  </li>
                  <li>You may pay online or mail a check/money order.</li>
                </ul>
              </div>
            </span>
            <span className="placeholder" />
          </div>
          <InfoNotificationComponent
            alertInfo={{
              message:
                'Do not include any additional documents (such as tax returns) with your Petition, except for any IRS Notices, the Statement of Taxpayer Identification Number and the Corporate Disclosure Statement (if filing for a business). Documents that might be evidence can be submitted at a later time.',
            }}
            dismissible={false}
            scrollToTop={false}
          />
          <div>
            <h3>Deadline to File</h3>
            <div className="petitioner-flow-text margin-bottom-2">
              If {isPetitioner ? 'you' : 'the petitioner'} received a notice in
              the mail from the IRS, it may show the last date to file or the
              number of days you have to file a Petition.{' '}
              <b>
                In most cases, the Court must receive your electronically filed
                Petition no later than 11:59 pm Eastern Time on the last date to
                file.
              </b>{' '}
              Petitions received after this date may be untimely and your case
              may be dismissed.
            </div>
          </div>
          <div className="grid-row grid-gap">
            <Accordion className="petitioner-accordion-title" headingLevel="3">
              <AccordionItem
                customTitleClassName="petitioner-accordion-title"
                key="Are you filing jointly with a spouse?"
                title={`${isPetitioner ? 'Are you' : 'Is the petitioner'} filing jointly with a spouse?`}
              >
                <div>
                  {isPetitioner
                    ? `To file a joint Petition with your spouse, you must have the
                  spouse's consent. If you do not have your spouse's consent,
                  select “Myself” as the person who is filing.`
                    : `To file a joint Petition with a spouse, the petitioner must have the spouse’s consent. 
                  If the petitioner does not have the spouse’s consent, 
                  select “Petitioner” as the person you are filing on behalf of.`}
                </div>
              </AccordionItem>
            </Accordion>
            {isPetitioner && (
              <Accordion
                className="petitioner-accordion-title"
                headingLevel="3"
              >
                <AccordionItem
                  customTitleClassName="petitioner-accordion-title"
                  key="Are you filing on behalf of someone else?"
                  title="Are you filing on behalf of someone else?"
                >
                  <div>
                    To file a case on behalf of someone else, you must be
                    authorized to practice before this Court as provided by the{' '}
                    <Button
                      link
                      className="usa-link--external text-left mobile-text-wrap"
                      href="https://ustaxcourt.gov/rules.html"
                      overrideMargin="margin-right-0"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Tax Court Rules of Practice and Procedure (Rule 60)
                    </Button>
                    {
                      '. Enrolled agents, certified public accountants, and attorneys who are not admitted to practice before the Court are not eligible to represent a party.'
                    }
                  </div>
                </AccordionItem>
              </Accordion>
            )}
            <Accordion className="petitioner-accordion-title" headingLevel="3">
              <AccordionItem
                customTitleClassName="petitioner-accordion-title"
                key="Are you filing for a business?"
                title="Are you filing for a business?"
              >
                <div className="margin-bottom-1">
                  {`If you're filing for a business, you'll need to complete and
                  submit the Corporate Disclosure Statement.`}
                </div>
                <div>
                  {
                    "Download and fill out the form if you haven't already done so:"
                  }
                </div>
                <Button
                  link
                  className="usa-link--external text-left mobile-text-wrap"
                  href="https://www.ustaxcourt.gov/resources/forms/Corporate_Disclosure_Statement_Form.pdf"
                  icon="file-pdf"
                  iconColor="blue"
                  overrideMargin="margin-right-0"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Corporate Disclosure Statement (T.C. Form 6)
                </Button>
              </AccordionItem>
            </Accordion>
          </div>
          <Button
            className="before-case-button"
            data-testid="go-to-step-1"
            href={redirectUrl}
          >
            {"I'm Ready to Start"}
          </Button>
          <Button
            className="before-case-button before-case-follow-up-button"
            data-testid="print-this-page"
            href="javascript:void(0);"
            secondary={true}
            onClick={() => {
              const elements = window.document.querySelectorAll(
                '[id^="ustc-ui-accordion-item-button"]',
              );

              elements.forEach((element: any) => {
                if (element.getAttribute('aria-expanded') !== 'true')
                  element.click();
              });

              setTimeout(() => window.print(), 100);
            }}
          >
            Print This Page
          </Button>
          <Button
            link
            className="before-case-button before-case-follow-up-button"
            data-testid="cancel-before-starting-case"
            href="javascript:void(0);"
            id="cancel"
            onClick={() => {
              closeModalAndReturnToDashboardSequence();
            }}
          >
            Cancel
          </Button>
        </section>
      </>
    );
  },
);

BeforeStartingCase.displayName = 'BeforeStartingCase';
