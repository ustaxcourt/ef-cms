import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Icon } from '../ustc-ui/Icon/Icon';
import React, { useState } from 'react';

const CaselessNotification = () => {
  const [isDisplayed, setIsDisplayed] = useState(true);

  return (
    isDisplayed && (
      <div className="card gray">
        <div className="card-content padding-3 position-relative">
          <Button
            link
            className="dismiss-btn margin-bottom-1 no-underline padding-0"
            icon="times-circle"
            iconRight={true}
            onClick={() => setIsDisplayed(false)}
          ></Button>

          <h3 className="display-flex">
            <Icon
              aria-label="high priority"
              className="iconHighPriority margin-right-1 margin-top-1"
              icon={['fas', 'exclamation-circle']}
              size="2x"
            />{' '}
            Have you already filed a petition by mail? Are you interested in
            electronic access to your existing case?
          </h3>

          <div>
            Do <b>NOT</b> start a new case. For more information about gaining
            electronic service for your existing case, email{' '}
            <a
              href={
                'mailto:dawson.support@ustaxcourt.gov?subject=eAccess to existing case'
              }
            >
              dawson.support@ustaxcourt.gov
            </a>
            . Include the docket number (e.g. 12345-67) of your case in your
            email.
          </div>
        </div>
      </div>
    )
  );
};

export const WhatToExpect = () => (
  <>
    <CaselessNotification />
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
              href="https://www.ustaxcourt.gov/resources/forms/Form_4_Statement_of_Taxpayer_Identification_Number.pdf"
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
              href="https://www.ustaxcourt.gov/resources/forms/Petition_Simplified_Form_2.pdf"
              icon="file-pdf"
              iconColor="blue"
              overrideMargin="margin-right-1"
              rel="noopener noreferrer"
              target="_blank"
            >
              Download Petition form (T.C. Form 2)
            </Button>
          </p>
          <p className="label">3. Corporate Disclosure Statement (CDS)</p>
          <p>
            If you’re filing on behalf of a business (this includes a
            corporation, partnership, and LLC), you’ll need to complete this to
            provide the court additional information about corporate interests
            in the business.
            <br />
            <Button
              link
              className="usa-link--external text-left mobile-text-wrap"
              href="https://www.ustaxcourt.gov/resources/forms/Corporate_Disclosure_Statement_Form.pdf"
              icon="file-pdf"
              iconColor="blue"
              overrideMargin="margin-right-1"
              rel="noopener noreferrer"
              target="_blank"
            >
              Download Corporate Disclosure Statement (T.C. Form 6)
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
      data-testid="file-a-petition"
      href="/before-filing-a-petition"
      icon="file"
      id="file-a-petition"
    >
      Start a Case
    </Button>
  </>
);

WhatToExpect.displayName = 'WhatToExpect';
