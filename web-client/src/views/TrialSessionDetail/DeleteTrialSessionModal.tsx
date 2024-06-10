import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DeleteTrialSessionModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    deleteTrialSessionSequence: sequences.deleteTrialSessionSequence,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
  },
  function DeleteTrialSessionModal({
    clearModalSequence,
    deleteTrialSessionSequence,
    formattedTrialSessionDetails,
  }) {
    return (
      <ConfirmModal
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Delete"
        title={'Are you sure you want to delete this trial session?'}
        onCancelSequence={clearModalSequence}
        onConfirmSequence={deleteTrialSessionSequence}
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

DeleteTrialSessionModal.displayName = 'DeleteTrialSessionModal';
