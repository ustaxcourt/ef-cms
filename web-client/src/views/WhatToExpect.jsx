import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const WhatToExpect = () => (
  <>
    <h2>What to Expect When Filing a Case Online</h2>
    <p>
      To start a case with the Tax Court, you’ll need to file a Petition and
      provide information about yourself and your dispute with the Internal
      Revenue Service (IRS) — you’ll be asked to upload some forms you can
      prepare in advance.
    </p>
    <div className="icon-list">
      <div className="icon-item">
        <div className="bullet-icon-wrapper">
          <div className="bullet-icon-circle">
            <FontAwesomeIcon
              className="bullet-icon"
              icon={['far', 'file-alt']}
              size="lg"
            />
          </div>
        </div>
        <span className="description-wrapper">
          <p>Here are the forms you can fill out before you get started:</p>
          <p className="label">
            1. Statement of Taxpayer Identification Number (STIN)
          </p>
          <p>
            This is used to help the IRS identify who you are. Everyone will
            need to upload this to create a case.
            <br />
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
              Download Statement of Taxpayer Identification Number (T.C. Form 4)
            </Button>
          </p>
          <p className="label">2. Petition form</p>
          <p>
            This is where you can explain why you disagree with the IRS. You can
            use the provided form or create your own Petition that complies with
            the requirements of the Tax Court Rules of Practice and Procedure.
            <br />
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
          </p>
          <p className="label">3. Ownership Disclosure Statement (ODS)</p>
          <p>
            If you’re filing on behalf of a business (this includes a
            corporation, partnership, and LLC), you’ll need to complete this to
            provide the court additional information about ownership interests
            in the business.
            <br />
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
        </span>
        <span className="placeholder" />
      </div>
      <div className="icon-description">
        <div className="bullet-icon-wrapper">
          <div className="bullet-icon-circle">
            <FontAwesomeIcon
              className="bullet-icon"
              icon={'dollar-sign'}
              size="lg"
            />
          </div>
        </div>
        <span className="description-wrapper">
          <p>
            After you submit your case, you’ll be asked to pay a $60 filing fee.
          </p>
        </span>
      </div>
      <div className="icon-description">
        <div className="bullet-icon-wrapper">
          <div className="bullet-icon-circle">
            <FontAwesomeIcon
              className="bullet-icon"
              icon={['far', 'user']}
              size="lg"
            />
          </div>
        </div>
        <span className="description-wrapper">
          <p>
            You’ll be able to log in to this portal at any time to view the
            status and take action on the case.
          </p>
        </span>
      </div>
    </div>
    <Button
      className="margin-right-0"
      href="/before-filing-a-petition"
      icon="file"
      id="file-a-petition"
    >
      Start a Case
    </Button>
  </>
);
