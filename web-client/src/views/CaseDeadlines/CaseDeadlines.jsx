import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import React from 'react';

export const CaseDeadlines = () => (
  <>
    <BigHeader text="Reports" />
    <section className="usa-section grid-container">
      <SuccessNotification />
      <ErrorNotification />

      <Tabs bind="reportTab" defaultActiveTab="Deadlines">
        <Tab
          id="reports-caseDeadlines-tab"
          tabName="Deadlines"
          title="Deadlines"
        >
          <p>Some Content</p>
        </Tab>
      </Tabs>
    </section>
  </>
);
