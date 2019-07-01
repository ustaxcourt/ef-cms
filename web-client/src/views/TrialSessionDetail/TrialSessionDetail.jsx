import { AllCases } from './AllCases';
import { ClosedCases } from './ClosedCases';
import { EligibleCases } from './EligibleCases';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OpenCases } from './OpenCases';
import { SetCalendarModalDialog } from './SetCalendarModalDialog';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialSessionInformation } from './TrialSessionInformation';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const TrialSessionDetail = connect(
  {
    formattedTrialSession: state.formattedTrialSessionDetails,
    openSetCalendarModalSequence: sequences.openSetCalendarModalSequence,
    showModal: state.showModal,
  },
  ({ formattedTrialSession, openSetCalendarModalSequence, showModal }) => (
    <>
      <div className="big-blue-header">
        <div className="grid-container">
          <div className="margin-bottom-1">
            <h1 tabIndex="-1">{formattedTrialSession.trialLocation}</h1>
            <span
              className={`usa-tag ${
                !formattedTrialSession.isCalendared ? 'ustc-tag--yellow' : ''
              }`}
            >
              <span aria-hidden="true">
                {formattedTrialSession.formattedTerm}:{' '}
                {formattedTrialSession.status}
              </span>
            </span>
          </div>
          <p className="margin-y-0" id="case-title">
            <span>{formattedTrialSession.formattedStartDate}</span>
          </p>
        </div>
      </div>

      <section className="usa-section grid-container">
        <SuccessNotification />
        <ErrorNotification />

        <TrialSessionInformation />

        {!formattedTrialSession.isCalendared && (
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

        {formattedTrialSession.isCalendared && (
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
