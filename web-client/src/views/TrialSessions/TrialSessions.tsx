import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialSessionsTable } from './TrialSessionsTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessions = connect(
  {
    defaultTab: state.screenMetadata.trialSessionFilters.status,
    openTrialSessionPlanningModalSequence:
      sequences.openTrialSessionPlanningModalSequence,
    showNewTrialSession: state.trialSessionsHelper.showNewTrialSession,
  },
  function TrialSessions({
    defaultTab,
    openTrialSessionPlanningModalSequence,
    showNewTrialSession,
  }) {
    return (
      <>
        <BigHeader text="Trial Sessions" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <Tabs
            bind="currentViewMetadata.trialSessions.tab"
            defaultActiveTab={defaultTab || 'open'}
            headingLevel="2"
            id="trial-sessions-tabs"
          >
            <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
              <Button
                link
                className="margin-top-1"
                icon="print"
                onClick={() => openTrialSessionPlanningModalSequence()}
              >
                Trial Session Planning Report
              </Button>
            </div>
            {showNewTrialSession && (
              <Button
                className="tab-right-button"
                data-testid="add-trial-session-button"
                href="/add-a-trial-session"
                icon="plus-circle"
              >
                Add Trial Session
              </Button>
            )}
            {showNewTrialSession && (
              <Tab
                data-testid="new-trial-sessions-tab"
                id="new-trial-sessions-tab"
                tabName="new"
                title="New"
              >
                <TrialSessionsTable filter="New" />
              </Tab>
            )}
            <Tab
              data-testid="open-trial-sessions-tab"
              id="open-trial-sessions-tab"
              tabName="open"
              title="Open"
            >
              <TrialSessionsTable filter="Open" />
            </Tab>
            <Tab
              data-testid="closed-trial-sessions-tab"
              id="closed-trial-sessions-tab"
              tabName="closed"
              title="Closed"
            >
              <TrialSessionsTable filter="Closed" />
            </Tab>
            <Tab
              data-testid="all-trial-sessions-tab"
              id="all-trial-sessions-tab"
              tabName="all"
              title="All"
            >
              <TrialSessionsTable filter="All" />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

TrialSessions.displayName = 'TrialSessions';
