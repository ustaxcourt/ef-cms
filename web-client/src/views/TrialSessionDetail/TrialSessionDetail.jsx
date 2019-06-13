import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SetCalendarModalDialog } from './SetCalendarModalDialog';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
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

        <div>Trial Session Info Goes Here</div>

        <Tabs defaultActiveTab="Eligible Cases">
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
            tabName="Eligible Cases"
            title="Eligible Cases"
            id="eligible-cases-tab"
          >
            <div id="eligible-cases-tab-content">
              <div>Eligible Cases</div>
            </div>
          </Tab>
        </Tabs>
      </section>
    </>
  ),
);
