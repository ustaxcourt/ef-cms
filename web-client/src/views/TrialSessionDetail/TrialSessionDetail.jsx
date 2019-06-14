import { EligibleCases } from './EligibleCases';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  ({ showModal, openSetCalendarModalSequence, formattedTrialSession }) => (
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
          <p id="case-title" className="margin-y-0">
            <span>{formattedTrialSession.formattedStartDate}</span>
          </p>
        </div>
      </div>

      <section className="usa-section grid-container">
        <SuccessNotification />
        <ErrorNotification />

        <TrialSessionInformation />

        {formattedTrialSession.showEligibleCases && (
          <Tabs
            defaultActiveTab="EligibleCases"
            bind="trialsessiondetails.caseList"
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
              tabName="EligibleCases"
              title="Eligible Cases"
              id="eligible-cases-tab"
            >
              <div id="eligible-cases-tab-content">
                <EligibleCases />
              </div>
            </Tab>
          </Tabs>
        )}
      </section>
    </>
  ),
);
