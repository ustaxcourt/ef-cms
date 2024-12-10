import { BigHeader } from '../BigHeader';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialLocationBlockedTable } from '@web-client/views/TrialSessions/TrialLocationBlockedTable';
import { TrialLocationTable } from '@web-client/views/TrialSessions/TrialLocationTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { Button } from '@web-client/ustc-ui/Button/Button';

export const TrialLocation = connect(
  {
    currentTab: state.trialLocationPage.currentTab,
    openTrialSessionPlanningModalSequence:
      sequences.openTrialSessionPlanningModalSequence,
    trialLocationHelper: state.trialLocationHelper,
  },
  function TrialLocation({
    currentTab,
    openTrialSessionPlanningModalSequence,
    trialLocationHelper,
  }) {
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
              onClick={() => openTrialSessionPlanningModalSequence()}
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
