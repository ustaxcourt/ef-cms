import { BigHeader } from '../BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialLocationBlockedTable } from '@web-client/views/TrialSessions/TrialLocationBlockedTable';
import { TrialLocationEligibleCasesTable } from '@web-client/views/TrialSessions/TrialLocationEligibleCasesTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialLocation = connect(
  {
    currentTab: state.trialLocationPage.currentTab,
    exportTrialLocationToCsvSequence:
      sequences.exportTrialLocationToCsvSequence,
    setCurrentTabSequence: sequences.setCurrentTabSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    trialLocationHelper: state.trialLocationHelper,
  },
  function TrialLocation({
    currentTab,
    exportTrialLocationToCsvSequence,
    setCurrentTabSequence,
    navigateBackSequence,
    trialLocationHelper,
  }) {
    const {
      formattedBlockedCases,
      formattedEligibleCases,
      location,
      isExportDisabled,
    } = trialLocationHelper;

    const handleTabSelect = tabName => {
      if (tabName !== currentTab) {
        setCurrentTabSequence({ currentTab: tabName });
      }
    };
    return (
      <>
        <BigHeader text={location} />
        <section className="usa-section grid-container">
          <div>
            <Button
              link
              noMargin
              className="margin-right-0"
              icon={['fa', 'arrow-alt-circle-left']}
              onClick={() => navigateBackSequence()}
            >
              Back to Trial Session Planning Report
            </Button>
          </div>
          <Button
            link
            aria-label="export trial location data as csv"
            className="margin-top-2 position-relative z-100 float-right"
            data-testid="export-report"
            disabled={isExportDisabled}
            icon="file-export"
            onClick={() => {
              exportTrialLocationToCsvSequence({
                blockedCases: trialLocationHelper.formattedBlockedCases,
                eligibleCases: trialLocationHelper.formattedEligibleCases,
              });
            }}
          >
            Export
          </Button>
          <Tabs
            defaultActiveTab={'eligibleCases'}
            headingLevel="2"
            id="trial-location-tabs"
            value={currentTab}
            onSelect={handleTabSelect}
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
              title={`Blocked Cases (${formattedBlockedCases.length})`}
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
