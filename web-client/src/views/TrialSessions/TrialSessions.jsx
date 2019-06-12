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

      <Tabs defaultActiveTab="Upcoming" bind="trialsessions.group">
        <a href="/add-a-trial-session" className="usa-button tab-right-button">
          <FontAwesomeIcon icon="plus-circle" size="1x" /> Add Trial Session
        </a>

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
