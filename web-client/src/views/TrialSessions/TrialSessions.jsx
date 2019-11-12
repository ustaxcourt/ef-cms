import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { UpcomingTrialSessions } from './UpcomingTrialSessions';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const TrialSessions = connect(
  {
    openTrialSessionPlanningModalSequence:
      sequences.openTrialSessionPlanningModalSequence,
  },
  ({ openTrialSessionPlanningModalSequence }) => {
    return (
      <>
        <BigHeader text="Trial Sessions" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <Tabs bind="trialSessionsTab.group" defaultActiveTab="Upcoming">
            <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
              <Button
                link
                className="margin-top-2"
                icon="print"
                onClick={() => openTrialSessionPlanningModalSequence()}
              >
                Trial Session Planning Report
              </Button>
            </div>

            <Button
              className="tab-right-button"
              href="/add-a-trial-session"
              icon="plus-circle"
            >
              Add Trial Session
            </Button>

            <Tab
              id="upcoming-trial-sessions-tab"
              tabName="Upcoming"
              title="Upcoming"
            >
              <UpcomingTrialSessions />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);
