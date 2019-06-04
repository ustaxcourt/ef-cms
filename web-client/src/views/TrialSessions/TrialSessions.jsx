import { ErrorNotification } from '../ErrorNotification';
import { HeaderDashboardInternal } from '../HeaderDashboardInternal';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { UpcomingTrialSessions } from './UpcomingTrialSessions';
import React from 'react';

export const TrialSessions = () => (
  <>
    <HeaderDashboardInternal />
    <section className="usa-section grid-container">
      <SuccessNotification />
      <ErrorNotification />
      <Tabs defaultActiveTab="Upcoming" bind="trialsessions.group">
        <Tab
          tabName="Upcoming"
          title="Upcoming"
          id="upcoming-trialsessions-tab"
        >
          <div id="upcoming-trialsessions-tab-content">
            <UpcomingTrialSessions />
          </div>
        </Tab>
      </Tabs>
    </section>
  </>
);
