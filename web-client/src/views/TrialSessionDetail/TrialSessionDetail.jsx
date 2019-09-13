import { AllCases } from './AllCases';
import { ClosedCases } from './ClosedCases';
import { EligibleCases } from './EligibleCases';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OpenCases } from './OpenCases';
import { SetCalendarModalDialog } from './SetCalendarModalDialog';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialSessionDetailHeader } from './TrialSessionDetailHeader';
import { TrialSessionInformation } from './TrialSessionInformation';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const TrialSessionDetail = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    openSetCalendarModalSequence: sequences.openSetCalendarModalSequence,
    showModal: state.showModal,
  },
  ({
    formattedTrialSessionDetails,
    openSetCalendarModalSequence,
    showModal,
  }) => (
    <>
      <TrialSessionDetailHeader />

      <section className="usa-section grid-container">
        <SuccessNotification />
        <ErrorNotification />

        <TrialSessionInformation />

        {!formattedTrialSessionDetails.isCalendared && (
          <Tabs
            bind="trialsessiondetails.caseList"
            defaultActiveTab="EligibleCases"
          >
            <button
              className="usa-button tab-right-button"
              onClick={() => openSetCalendarModalSequence()}
            >
              <FontAwesomeIcon icon="calendar-check" size="1x" /> Set Calendar
              {showModal == 'SetCalendarModalDialog' && (
                <SetCalendarModalDialog />
              )}
            </button>
            <Tab
              id="eligible-cases-tab"
              tabName="EligibleCases"
              title="Eligible Cases"
            >
              <div id="eligible-cases-tab-content">
                <EligibleCases />
              </div>
            </Tab>
          </Tabs>
        )}

        {formattedTrialSessionDetails.isCalendared && (
          <Tabs
            bind="trialsessiondetails.calendaredCaseList"
            defaultActiveTab="OpenCases"
          >
            <Tab id="open-cases-tab" tabName="OpenCases" title="Open Cases">
              <div id="open-cases-tab-content">
                <OpenCases />
              </div>
            </Tab>
            <Tab
              id="closed-cases-tab"
              tabName="ClosedCases"
              title="Closed Cases"
            >
              <div id="closed-cases-tab-content">
                <ClosedCases />
              </div>
            </Tab>
            <Tab id="all-cases-tab" tabName="AllCases" title="All Cases">
              <div id="all-cases-tab-content">
                <AllCases />
              </div>
            </Tab>
          </Tabs>
        )}
      </section>
    </>
  ),
);
