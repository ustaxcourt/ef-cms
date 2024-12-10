import { BigHeader } from '../BigHeader';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialLocationBlockedTable } from '@web-client/views/TrialSessions/TrialLocationBlockedTable';
import { TrialLocationTable } from '@web-client/views/TrialSessions/TrialLocationTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialLocation = connect(
  {
    currentTab: state.trialLocationPage.currentTab,
    trialLocationHelper: state.trialLocationHelper,
  },
  function TrialLocation({ currentTab, trialLocationHelper }) {
    const { blockedCases, formattedEligibleCases, location } =
      trialLocationHelper;
    return (
      <>
        <BigHeader text={location} />
        <section className="usa-section grid-container">
          <Tabs
            defaultActiveTab={'eligibleCases'}
            headingLevel="2"
            id="trial-location-tabs"
            value={currentTab}
            onSelect={(tabName: 'eligibleCases' | 'blockedCases') => {
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
              title={`Eligible Cases (${formattedEligibleCases.length})`}
            >
              <TrialLocationTable />
            </Tab>
            <Tab
              data-testid="blocked-cases-tab"
              id="blocked-cases-tab"
              key="blockedCases"
              tabName="blockedCases"
              title={`Blocked Cases (${blockedCases.length})`}
            >
              <TrialLocationBlockedTable />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

TrialLocation.displayName = 'TrialLocation';
