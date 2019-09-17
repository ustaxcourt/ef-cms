import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MAX_FILE_SIZE_MB } from '../../../shared/src/persistence/s3/getUploadPolicy';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import React from 'react';
import howToMergePDFs from '../pdfs/how-to-merge-pdfs.pdf';
import paperclipSlashIcon from '../images/paperclip-no-icon.svg';

export const BeforeStartingCase = () => (
  <>
    <div className="big-blue-header">
      <div className="grid-container">
        <div className="grid-row">
          <div className="tablet:grid-col-6">
            <h1 className="captioned" tabIndex="-1">
              <NonMobile>File a Petition</NonMobile>
              <Mobile>Petition Filing Guide</Mobile>
            </h1>
          </div>
        </div>
      </div>
    </div>
    <section className="usa-section before-starting-case grid-container">
      <h1 className="captioned margin-bottom-2" tabIndex="-1">
        Tips for Preparing Documents Before You File
      </h1>
      <div className="grid-container padding-x-0" role="list">
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-6">
            <div className="caseItem" role="listitem">
              <div className="caseItem__icon" role="display">
                <FontAwesomeIcon icon="user-check" />
              </div>
              <h2 className="caseItem__heading">
                1. Are you authorized to file on behalf of this taxpayer?
              </h2>
              <div className="caseItem__content">
                <p>
                  To file a case on behalf of another taxpayer, you must be
                  authorized to litigate in this Court as provided by the Tax
                  Court Rules of Practice and Procedure (Rule 60). Enrolled
                  agents, certified public accountants, and powers of attorney
                  who are not admitted to practice before the Court are not
                  eligible to represent taxpayers.
                </p>
              </div>
            </div>
            <div className="caseItem" role="listitem">
              <div className="caseItem__icon" role="display">
                <FontAwesomeIcon icon={['far', 'copy']} />
              </div>
              <h2 className="caseItem__heading">
                2. Have the IRS Notice(s) Youʼve Received Available to Submit
              </h2>
              <div className="caseItem__content">
                <p>
                  If you’ve received an IRS notice, such as a Notice of
                  Deficiency or Notice of Determination, you’ll need to include
                  a copy with your Petition. The U.S. Tax Court must receive all
                  Petitions in a timely manner. The IRS notice shows the last
                  date to file or the number of days you have to file a
                  Petition.{' '}
                  <strong>
                    The Court must receive your electronically filed Petition no
                    later than 11:59 pm Eastern Time on the last date to file.
                  </strong>
                </p>
              </div>
            </div>
            <div className="margin-bottom-0 caseItem" role="listitem">
              <div className="caseItem__icon" role="display">
                <FontAwesomeIcon icon={['far', 'edit']} />
              </div>
              <h2 className="caseItem__heading">
                3. Fill Out The Required Forms
              </h2>
              <div className="caseItem__content">
                <p className="label">Petition Form</p>
                <p>
                  Complete the Petition form,{' '}
                  <a
                    href="https://www.ustaxcourt.gov/forms/Petition_Simplified_Form_2.pdf"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    USTC Form 2
                  </a>
                  , or you can upload your own Petition that complies with the
                  requirements of the{' '}
                  <a
                    href="https://www.ustaxcourt.gov/rules.htm"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Tax Court Rules of Practice and Procedure
                  </a>
                  . <strong>Do not</strong> include personal information (such
                  as Social Security Numbers, Taxpayer Identification Numbers,
                  or Employer Identification Numbers, birthdates, names of minor
                  children, or financial account information) in your Petition.
                </p>
                <p className="label">Statement of Taxpayer Identification</p>
                <p>
                  Complete the Statement of Taxpayer Identification form,{' '}
                  <a
                    href="https://www.ustaxcourt.gov/forms/Form_4_Statement_of_Taxpayer_Identification_Number.pdf"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    USTC Form 4
                  </a>
                  . This is the only document that should contain your Social
                  Security Number (SSN), Taxpayer Identification Number (TIN),
                  or Employer Identification Number (EIN). This document is sent
                  to the IRS to help identify you, but it’s never viewed by the
                  Court or stored as part of the public record.
                </p>
                <p className="label">Ownership Disclosure Statement</p>
                <p>
                  If you’re filing for a business, you’ll need to complete and
                  submit the Ownership Disclosure Statement,{' '}
                  <a
                    href="https://www.ustaxcourt.gov/forms/Ownership_Disclosure_Statement_Form_6.pdf"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    USTC Form 6
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
          <div className="tablet:grid-col-6">
            <div className="caseItem" role="listitem">
              <div className="caseItem__icon" role="display">
                <FontAwesomeIcon icon={['fa', 'shield-alt']} />
              </div>
              <h2 className="caseItem__heading">
                4. Remove Personal Information From Your Petition and IRS
                Notice(s)
              </h2>
              <div className="caseItem__content">
                <p>
                  If the IRS notice includes personal information (such as
                  Social Security Numbers, Taxpayer Identification Numbers, or
                  Employer Identification Numbers), remove or redact that
                  information before including it with your Petition. You can
                  remove this information by deleting it, marking through it so
                  itʼs illegible, or any other method that will prevent it from
                  being seen.
                </p>
              </div>
            </div>

            <div className="caseItem" role="listitem">
              <div className="caseItem__icon" role="display">
                <FontAwesomeIcon icon={['far', 'file-pdf']} />
              </div>
              <h2 className="caseItem__heading">
                5. Combine Your Petition and IRS Notice(s) Into a Single PDF
              </h2>
              <div className="caseItem__content">
                <p>
                  Scan your Petition and IRS notice into one Petition PDF or
                  combine them digitally. This is what youʼll upload to the
                  Court to start your case. Uploads are limited to{' '}
                  {MAX_FILE_SIZE_MB}MB.{' '}
                  <a
                    href={howToMergePDFs}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Learn more about how to merge files into one PDF.
                  </a>
                </p>
              </div>
            </div>
            <div className="caseItem" role="listitem">
              <div className="caseItem__icon" role="display">
                <div className="svg-wrapper">
                  <img
                    aria-hidden="true"
                    className="svg"
                    src={paperclipSlashIcon}
                  />
                </div>
              </div>
              <h2 className="caseItem__heading">
                6. Donʼt Submit Extra Documents With Your Petition
              </h2>
              <div className="caseItem__content">
                <p>
                  <strong>Do not</strong> include any additional documents with
                  your Petition, except for the IRS notice. Documents that might
                  be evidence can be submitted at a later time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="button-box-container">
        <a
          className="usa-button margin-right-205 margin-bottom-4"
          href="/file-a-petition/step-1"
        >
          Got It, Letʼs File My Petition
        </a>
        <a className="usa-button usa-button--unstyled" href="/">
          Cancel
        </a>
      </div>
    </section>
  </>
);
