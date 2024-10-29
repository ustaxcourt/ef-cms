import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { PublicTrialSessionInformation } from '@web-client/views/Public/TrialSessions/PublicTrialSessionInformation';
import { SuccessNotification } from '@web-client/views/SuccessNotification';
import { TrialSessionDetailHeader } from '@web-client/views/TrialSessionDetail/TrialSessionDetailHeader';
import { WarningNotification } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PublicTrialSessionDetail = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    closeTrialSessionSequence: sequences.closeTrialSessionSequence,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    openConfirmModalSequence: sequences.openConfirmModalSequence,
    openSetCalendarModalSequence: sequences.openSetCalendarModalSequence,
    showModal: state.modal.showModal,
    showThirtyDayNoticeModalSequence:
      sequences.showThirtyDayNoticeModalSequence,
    trialSessionDetailsHelper: state.trialSessionDetailsHelper,
  },
  function PublicTrialSessionDetail() {
    console.log('TrialSessionDetail');
    return (
      <>
        <TrialSessionDetailHeader />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <WarningNotification />

          <PublicTrialSessionInformation />
          {/* TODO: Open cases */}
        </section>
      </>
    );
  },
);

PublicTrialSessionDetail.displayName = 'PublicTrialSessionDetail';
