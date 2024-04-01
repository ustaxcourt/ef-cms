import { ALLOWLIST_FEATURE_FLAGS } from '../../../shared/src/business/entities/EntityConstants';
import {
  Accordion,
  AccordionItem,
} from '@web-client/ustc-ui/Accordion/Accordion';
import { Button } from '../ustc-ui/Button/Button';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const BeforeStartingCase = connect(
  {
    featureFlags: state.featureFlags,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
  },
  function BeforeStartingCase({
    featureFlags,
    formCancelToggleCancelSequence,
    showModal,
  }) {
    const rdirectUrl = featureFlags[
      ALLOWLIST_FEATURE_FLAGS.UPDATED_PETITION_FLOW.key
    ]
      ? '/file-a-petition/new'
      : '/file-a-petition/step-1';
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <h1 className="captioned" tabIndex={-1}>
                  Create a case
                </h1>
              </div>
            </div>
          </div>
        </div>
        <section className="usa-section grid-container">
          <h3>How to Create a Case</h3>
          <WarningNotificationComponent
            alertWarning={{
              message:
                'Do not include personal information (such as Social Security Numbers, Taxpayer Identification Numbers, Employer Identification Numbers, birthdates, names of minor children, or financial account information) in your Petition or any other filing with the Court except in the Statement of Taxpayer Identification.',
            }}
            dismissible={false}
            scrollToTop={false}
          />
          <div className="petitioner-flow-text">
            Before starting a case, you can prepare forms and documents in
            advance.{' '}
            <b>
              {`Once you start a case, you won't be able to save your work and
              come back to it.`}
            </b>{' '}
            {`After the case has been processed, you'll be able to log in at any
            time to view the status and take action on the case.`}
          </div>
          <div className="petitioner-flow-text">
            <span>
              <div className="petitioner-label">1. Complete the Petition</div>
              <div className="petitioner-flow-text">
                <ul className="margin-top-0">
                  <li>
                    This is the document that explains why you disagree with the
                    Internal Revenue Service (IRS). There are three methods to
                    add the Petition:
                  </li>
                  <ul className="margin-top-0">
                    <li>
                      Answer some questions and have DAWSON create the Petition.
                    </li>
                    <li>
                      {
                        "Complete and upload the Court's standard Petition form. "
                      }
                      <Button
                        link
                        className="usa-link--external text-left mobile-text-wrap"
                        href="https://www.ustaxcourt.gov/resources/forms/Petition_Simplified_Form_2.pdf"
                        icon="file-pdf"
                        iconColor="blue"
                        overrideMargin="margin-right-1"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Petition form (T.C. Form 2)
                      </Button>
                    </li>
                    <li>
                      Upload your own Petition that complies with the
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
                </ul>
              </div>
              <div className="petitioner-label">2. Upload IRS Notice(s)</div>
              <div
                className="petitioner-flow-text"
                style={{ marginBottom: '5px' }}
              >
                If you received a Notice(s) from the IRS:
              </div>
              <ul className="margin-top-0">
                <li>Submit a PDF of the Notice(s) you received.</li>
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
                    sent to the IRS to help them identify you, but it's never
                    visible as part of the case record. This is the only
                    document that should contain your SSN, TIN, or EIN.`}
                  </li>
                  <li>
                    {' '}
                    <Button
                      link
                      className="usa-link--external text-left mobile-text-wrap"
                      href="https://www.ustaxcourt.gov/rules.html"
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
                'Do not include any additional documents (such as tax returns) with your Petition, except for any IRS Notices, the Statement of Taxpayer Identification and the Corporate Disclosure Statement (if filing for a business). Documents that might be evidence can be submitted at a later time.',
            }}
            dismissible={false}
            scrollToTop={false}
          />
          <div>
            <h3>Deadline to File</h3>
            <div className="petitioner-flow-text margin-bottom-20">
              If you received a notice in the mail from the IRS, it may show the
              last date to file or the number of days you have to file a
              Petition.{' '}
              <b>
                In most cases, the Court must receive your electronically filed
                Petition no later than 11:59 pm Eastern Time on the last date to
                file.
              </b>{' '}
              Petitions received after this date may be untimely and your case
              may be dismissed for lack of jurisdiction.
            </div>
          </div>
          <div className="grid-row grid-gap grid-col-10 margin-top-20">
            <Accordion
              className="petitioner-accordion-title"
              headingLevel="3"
              role="listitem"
            >
              <AccordionItem
                key="Are you filing jointly with a spouse?"
                title="Are you filing jointly with a spouse?"
              >
                <div>
                  To file a joint Petition with your spouse, you must have their
                  consent. Both you and your spouse should{' '}
                  <Button
                    link
                    className="usa-link--external text-left mobile-text-wrap"
                    href="https://ustaxcourt.gov/dawson_faqs_case_management.html#CASE7"
                    overrideMargin="margin-right-0"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    sign the Petition
                  </Button>
                  {`. If you do not have your spouse's consent, select “Myself” as
                  the person who is filing.`}
                </div>
              </AccordionItem>
            </Accordion>
            <Accordion
              className="petitioner-accordion-title"
              headingLevel="3"
              role="listitem"
            >
              <AccordionItem
                key="Are you filing on behalf of someone else?"
                title="Are you filing on behalf of someone else?"
              >
                <div>
                  To file a case on behalf of another taxpayer, you must be
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
                    '. Enrolled agents, certified public accountants, and attorneys who are not admitted to practice before the Court are not eligible to represent taxpayers.'
                  }
                </div>
              </AccordionItem>
            </Accordion>
            <Accordion
              className="petitioner-accordion-title"
              headingLevel="3"
              role="listitem"
            >
              <AccordionItem
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
                  href="https://ustaxcourt.gov/rules.html"
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
            className="margin-top-5"
            data-testid="go-to-step-1"
            href={rdirectUrl}
          >
            {"I'm Ready to Start"}
          </Button>
          <Button
            link
            id="cancel"
            onClick={() => {
              formCancelToggleCancelSequence();
            }}
          >
            Cancel
          </Button>
        </section>
        {showModal == 'FormCancelModalDialog' && (
          <FormCancelModalDialog
            useRunConfirmSequence={true}
            onCancelSequence="closeModalAndReturnToDashboardSequence"
          />
        )}
      </>
    );
  },
);

BeforeStartingCase.displayName = 'BeforeStartingCase';
