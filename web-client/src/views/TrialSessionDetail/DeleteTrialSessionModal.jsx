import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DeleteTrialSessionModal = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
  },
  ({ formattedTrialSessionDetails }) => {
    return (
      <ConfirmModal
        cancelLabel="No, cancel"
        confirmLabel="Yes, delete"
        title={'Are you sure you want to delete this trial session?'}
        onCancelSequence="clearModalSequence"
        onConfirmSequence="deleteTrialSessionSequence"
      >
        This will delete the{' '}
        {formattedTrialSessionDetails.formattedStartDateFull} trial session in{' '}
        <span className="no-wrap">
          {formattedTrialSessionDetails.trialLocation}.
        </span>
      </ConfirmModal>
    );
  },
);
