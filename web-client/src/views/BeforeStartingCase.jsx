import { Accordion, AccordionItem } from '../ustc-ui/Accordion/Accordion';
import { Button } from '../ustc-ui/Button/Button';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import howToMergePdfs from '../pdfs/how-to-merge-pdfs.pdf';

export const BeforeStartingCase = connect(
  {
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
  },
  function BeforeStartingCase({ formCancelToggleCancelSequence, showModal }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <h1 className="captioned" tabIndex="-1">
                  <NonMobile>Create a case</NonMobile>
                  <Mobile>How to Create a case</Mobile>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <section className="usa-section before-starting-case grid-container">
          <h2 className="captioned margin-bottom-2" tabIndex="-1">
            Instructions For Creating a Case
          </h2>
          <p className="margin-bottom-5">
            Before starting the filing process please review the helpful tips
            provided below. This will help instruct you in what is needed and
            how to go about proceeding with filing your Petition.
          </p>
          <div
            className="grid-container padding-x-0 margin-bottom-5 create-case-steps"
            role="list"
          >
            <div className="grid-row grid-gap grid-col-10">
              <Accordion headingLevel="3">
                <AccordionItem
                  displayIcon="true"
                  iconClassName="bullet-icon"
                  iconSize="lg"
                  iconTypes={['far', 'clock']}
                  key="Check the deadline for filing"
                  title="Check the deadline for filing"
                >
                  <p>
                    You may have received a notice in the mail from the Internal
                    Revenue Service (IRS). The IRS notice may show the last date
                    to file or the number of days you have to file a Petition.
                    <strong>
                      The Court must receive your electronically filed Petition
                      no later than 11:59 pm Eastern Time on the last date to
                      file.
                    </strong>{' '}
                    Petitions received after this date are untimely and your
                    case may be dismissed for lack of jurisdiction.
                  </p>
                </AccordionItem>
              </Accordion>
              <Accordion headingLevel="3">
                <AccordionItem
                  displayIcon="true"
                  iconClassName="bullet-icon"
                  iconSize="lg"
                  iconTypes={['fa', 'fingerprint']}
                  key="Confirm your identity"
                  title="Confirm your identity"
                >
                  <p>
                    You’ll be asked to upload your Statement of Taypayer
                    Identification Number (STIN)* form in Step 1 of creating a
                    case. This document is sent to the IRS to help them identify
                    you, but it’s never stored as public record.
                  </p>
                  <p className="label">
                    If you didn’t already fill out the form, you can download it
                    now.
                  </p>
                  <p className="margin-top-0">
                    <Button
                      link
                      className="usa-link--external text-left mobile-text-wrap"
                      href="https://www.ustaxcourt.gov/forms/Form_4_Statement_of_Taxpayer_Identification_Number.pdf"
                      icon="file-pdf"
                      iconColor="blue"
                      overrideMargin="margin-right-1"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Download Statement of Taxpayer Identification Number (T.C.
                      Form 4)
                    </Button>
                    <br />
                    <span className="usa-hint">
                      *This is the only document that should contain your Social
                      Security Number (SSN), Taxpayer Identification Number
                      (TIN), or Employer Identification Number (EIN).{' '}
                      <strong>Do not include</strong> your SSN, TIN, or EIN on
                      any other document you file with the Court.
                    </span>
                  </p>
                </AccordionItem>
              </Accordion>
              <Accordion headingLevel="3">
                <AccordionItem
                  displayIcon="true"
                  iconClassName="bullet-icon"
                  iconSize="lg"
                  iconTypes={['far', 'edit']}
                  key="Prepare the petition"
                  title="Prepare the petition"
                >
                  <p className="label">1. Complete Your Petition</p>
                  <p>
                    This is the document that explains why you’re challenging
                    the IRS’s determination. You can complete the Court’s
                    standard Petition form or you can upload your own Petition
                    that complies with the requirements of the Tax Court Rules
                    of Practice and Procedure.
                  </p>
                  <p className="label">
                    If you didn’t already fill out the form, you can download it
                    now.
                  </p>
                  <p className="margin-top-0">
                    <Button
                      link
                      className="usa-link--external text-left mobile-text-wrap"
                      href="https://www.ustaxcourt.gov/forms/Petition_Simplified_Form_2.pdf"
                      icon="file-pdf"
                      iconColor="blue"
                      overrideMargin="margin-right-1"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Download Petition form (T.C. Form 2)
                    </Button>
                    <br />
                    <span className="usa-hint">
                      *<strong>Do not include</strong> personal information
                      (such as Social Security Numbers, Taxpayer Identification
                      Numbers, or Employer Identification Numbers, birthdates,
                      names of minor children, or financial account information)
                      in your Petition or any other filing with the Court.
                    </span>
                  </p>
                  <p className="label">
                    2. Create a PDF of your Petition and IRS notice (if you
                    received one)
                  </p>
                  <p className="margin-top-0">
                    Scan your Petition and IRS notice into one Petition PDF (max
                    file size of 250MB) or combine them digitally.
                    <Button
                      link
                      className="usa-link--external text-left mobile-text-wrap"
                      href={howToMergePdfs}
                      icon="file-pdf"
                      iconColor="blue"
                      overrideMargin="margin-right-1 margin-left-1"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Learn more about how to merge files into one PDF.
                    </Button>
                    <br />
                    <span className="usa-hint">
                      *<strong>Do not include</strong> any additional documents
                      with your Petition, except for the IRS notice. Documents
                      that might be evidence can be submitted at a later time.
                    </span>
                  </p>
                </AccordionItem>
              </Accordion>
              <Accordion headingLevel="3">
                <AccordionItem
                  displayIcon="true"
                  iconClassName="bullet-icon"
                  iconSize="lg"
                  iconTypes={['far', 'user']}
                  key="If you’re filing jointly with a spouse, for someone else or for a business …"
                  title="If you’re filing jointly with a spouse, for someone else or for a business …"
                >
                  <p className="label">Joint Petition With A Spouse</p>
                  <p>
                    To file a joint Petition with your spouse, you must have
                    their consent. Both you and your spouse must sign the
                    Petition form. If you do not have their consent, select
                    “Myself” as the person who is filing.
                  </p>
                  <p className="label">Someone Else</p>
                  <p>
                    To file a case on behalf of another taxpayer, you must be
                    authorized in this Court as provided by the Tax Court Rules
                    of Practice and Procedure (Rule 60). Enrolled agents,
                    certified public accountants, and powers of attorney who are
                    not admitted to practice before the Court are not eligible
                    to represent taxpayers.
                  </p>
                  <p className="label">A Business</p>
                  <p>
                    If you’re filing for a business, you’ll need to complete and
                    submit the Ownership Disclosure Statement.
                  </p>
                  <p className="label">
                    If you didn’t already fill out the form, you can download it
                    now.
                  </p>
                  <p className="margin-top-0">
                    <Button
                      link
                      className="usa-link--external text-left mobile-text-wrap"
                      href="https://www.ustaxcourt.gov/forms/Ownership_Disclosure_Statement_Form_6.pdf"
                      icon="file-pdf"
                      iconColor="blue"
                      overrideMargin="margin-right-1"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Download Ownership Disclosure Statement (T.C. Form 6)
                    </Button>
                  </p>
                </AccordionItem>
              </Accordion>
              <div className="grid-col-12">
                <hr />
                <p>
                  Next you’ll continue to follow the steps to upload your
                  documents and fill in the requested information that will
                  create your case.
                </p>
              </div>
            </div>
          </div>
          <Button href="/file-a-petition/step-1">
            Got It, Letʼs Start a Case
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
