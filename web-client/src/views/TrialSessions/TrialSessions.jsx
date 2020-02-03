import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialSessionsTable } from './TrialSessionsTable';
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

          <Tabs bind="trialSessionsTab.group" defaultActiveTab="All">
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
            <Tab id="new-trial-sessions-tab" tabName="New" title="New">
              <TrialSessionsTable filter="new" />
            </Tab>
            <Tab id="open-trial-sessions-tab" tabName="Open" title="Open">
              <TrialSessionsTable filter="open" />
            </Tab>
            <Tab id="closed-trial-sessions-tab" tabName="Closed" title="Closed">
              <TrialSessionsTable filter="closed" />
            </Tab>
            <Tab id="all-trial-sessions-tab" tabName="All" title="All">
              <TrialSessionsTable filter="all" />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);
