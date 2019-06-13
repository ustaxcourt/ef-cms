import { BigHeader } from '../BigHeader';
import { EligibleCases } from './EligibleCases';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import React from 'react';

export const TrialSessionDetail = () => (
  <>
    <BigHeader text="Session Information" />
    <section className="usa-section grid-container">
      <SuccessNotification />
      <ErrorNotification />

      <Tabs
        defaultActiveTab="EligibleCases"
        bind="trialsessiondetails.caseList"
      >
        <Tab
          tabName="EligibleCases"
          title="Eligible Cases"
          id="eligible-cases-tab"
        >
          <div id="eligible-cases-tab-content">
            <EligibleCases />
          </div>
        </Tab>
      </Tabs>
    </section>
  </>
);
