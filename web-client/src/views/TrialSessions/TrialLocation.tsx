import { BigHeader } from '../BigHeader';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { TrialLocationTable } from '@web-client/views/TrialSessions/TrialLocationTable';
import React from 'react';

export const TrialLocation = connect(
  {
    currentTab: state.trialLocationPage.currentTab,
    trialLocationHelper: state.trialLocationHelper,
  },
  function TrialLocation({ currentTab, trialLocationHelper }) {
    return (
      <>
        <BigHeader text={trialLocationHelper.location} />
        <section className="usa-section grid-container">
          <Tabs
            defaultActiveTab={'eligibleCases'}
            headingLevel="2"
            id="trial-location-tabs"
            value={currentTab}
            onSelect={(tabName: 'eligibleCases' | 'blockCases') => {
              if (tabName === currentTab) {
                return;
              }
            }}
          >
            <Tab
              data-testid="eligible-cases-sessions-tab"
              id="eligible-cases-sessions-tab"
              key="eligibleCases"
              tabName="eligibleCases"
              title="Eligible Cases"
            >
              {' '}
              <TrialLocationTable />
            </Tab>
            <Tab
              data-testid="blocked-cases-tab"
              id="blocked-cases-tab"
              key="blockedCases"
              tabName="blockedCases"
              title="Blocked Cases"
            ></Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

TrialLocation.displayName = 'TrialLocation';
