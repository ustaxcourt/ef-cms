import { BigHeader } from '../BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialLocationBlockedTable } from '@web-client/views/TrialSessions/TrialLocationBlockedTable';
import { TrialLocationEligibleCasesTable } from '@web-client/views/TrialSessions/TrialLocationEligibleCasesTable';
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
          <div>
            <Button
              link
              noMargin
              className="margin-right-0"
              icon="print"
              onClick={() => {}}
            >
              Back to Trial Session Planning Report
            </Button>
          </div>
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
              <TrialLocationEligibleCasesTable />
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
