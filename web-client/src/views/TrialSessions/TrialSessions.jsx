import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { UpcomingTrialSessions } from './UpcomingTrialSessions';
import React from 'react';

export const TrialSessions = () => (
  <>
    <BigHeader text="Trial Sessions" />
    <section className="usa-section grid-container">
      <SuccessNotification />
      <ErrorNotification />

      <Tabs bind="trialsessions.group" defaultActiveTab="Upcoming">
        <Button
          className="tab-right-button"
          href="/add-a-trial-session"
          icon="plus-circle"
        >
          Add Trial Session
        </Button>

        <Tab
          id="upcoming-trialsessions-tab"
          tabName="Upcoming"
          title="Upcoming"
        >
          <UpcomingTrialSessions />
        </Tab>
      </Tabs>
    </section>
  </>
);
