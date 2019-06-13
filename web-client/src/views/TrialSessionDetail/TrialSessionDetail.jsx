import { BigHeader } from '../BigHeader';
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
    openSetCalendarModalSequence: sequences.openSetCalendarModalSequence,
    showModal: state.showModal,
  },
  ({ showModal, openSetCalendarModalSequence }) => (
    <>
      <BigHeader text="Session Information" />
      <section className="usa-section grid-container">
        <SuccessNotification />
        <ErrorNotification />

        <TrialSessionInformation />

        <Tabs
          defaultActiveTab="EligibleCases"
          bind="trialsessiondetails.caseList"
        >
          <Tab
            tabName="EligibleCases"
            title="Eligible Cases"
            id="eligible-cases-tab"
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
            <div id="eligible-cases-tab-content">
              <EligibleCases />
            </div>
          </Tab>
        </Tabs>
      </section>
    </>
  ),
);
