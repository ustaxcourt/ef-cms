import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        <a className="usa-button tab-right-button" href="/add-a-trial-session">
          <FontAwesomeIcon icon="plus-circle" size="1x" /> Add Trial Session
        </a>

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
