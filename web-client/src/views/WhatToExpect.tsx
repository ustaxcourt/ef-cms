import { Button } from '../ustc-ui/Button/Button';
import { ErrorBanner } from '@web-client/views/ErrorBanner';
import React from 'react';

export const WhatToExpect = () => (
  <>
    <ErrorBanner
      showSingleMessage
      messages={[
        `Do not start a new case. Email <a href={
        'mailto:dawson.support@ustaxcourt.gov?subject=eAccess to existing case'
      }>
      dawson.support@ustaxcourt.gov</a> with your case's docket number (e.g. 12345-67) to get access to
    your existing case.`,
      ]}
      title="Have you already filed a petition by mail or want electronic access to
    your existing case?"
    />
    <h2>Welcome to DAWSON!</h2>
    <p className="what-to-expect-text">
      {`DAWSON (Docket Access Within a Secure Online Network) is the U.S. Tax
      Court's electronic filing and case management system. The Court encourages
      all petitioners to file their Petition (case) and all documents
      electronically.`}
    </p>
    <p className="what-to-expect-text">DAWSON allows you to:</p>

    <p className="icon-list">
      <p>
        <ul>
          <li>Immediately receive a Case Docket number upon filing</li>
          <li>File documents electronically</li>
          <li>Access your case documents over the internet</li>
          <li>Receive email notifications anytime there is activity in your</li>
        </ul>
      </p>
    </p>
    <p className="what-to-expect-text">
      {`To create a case, you'll need to submit a Petition to the Court. After the
      Petition is processed by the Court, you'll be able to view the status of
      your case, submit new documents (such as evidence) and perform other
      actions.`}
    </p>
    <Button
      className="margin-right-0"
      data-testid="file-a-petition"
      href="/before-filing-a-petition"
      id="file-a-petition"
    >
      Create a Case
    </Button>
  </>
);

WhatToExpect.displayName = 'WhatToExpect';
