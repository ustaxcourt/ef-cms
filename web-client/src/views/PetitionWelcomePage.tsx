import { Button } from '../ustc-ui/Button/Button';
import { ErrorBanner } from '@web-client/views/ErrorBanner';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import React from 'react';

export const PetitionWelcomePage = ({
  isPetitioner,
  welcomeMessage,
  welcomeMessageTitle,
}) => (
  <>
    {isPetitioner ? (
      <ErrorBanner
        showSingleMessage
        messages={[welcomeMessage]}
        title={welcomeMessageTitle}
      />
    ) : (
      <WarningNotificationComponent
        alertWarning={{
          message: welcomeMessage,
          title: welcomeMessageTitle,
        }}
        dismissible={false}
        scrollToTop={false}
      />
    )}
    <h2 data-testid="petition-welcome-text">Welcome to DAWSON!</h2>
    <div className="petitioner-flow-text">
      {`DAWSON (Docket Access Within a Secure Online Network) is the U.S. Tax
      Court's electronic filing and case management system.`}
    </div>
    <div className="petitioner-flow-text">DAWSON allows you to:</div>
    <div className="petitioner-flow-text">
      <ul style={{ marginBottom: '0px', marginTop: '0px' }}>
        <li>Immediately receive a docket number upon filing a Petition</li>
        <li>File and view documents electronically</li>
        <li>Access case documents over the internet</li>
        <li>
          {`Receive email notifications anytime there is activity in ${isPetitioner ? 'your' : 'the'} case`}
        </li>
      </ul>
    </div>
    <div className="petitioner-flow-text">
      {`To create a case, you'll need to submit a Petition to the Court. After the
      Petition is processed by the Court, you'll be able to view the status of
      ${isPetitioner ? 'your' : 'the'} case, submit new documents and perform other
      actions.`}
    </div>
    <Button
      className="margin-top-3"
      data-testid="file-a-petition"
      href="/before-filing-a-petition"
      id="file-a-petition"
    >
      Create a Case
    </Button>
  </>
);

PetitionWelcomePage.displayName = 'PetitionWelcomePage';
