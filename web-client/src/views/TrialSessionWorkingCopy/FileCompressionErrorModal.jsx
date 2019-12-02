import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const FileCompressionErrorModal = connect(
  {
    trialSession: state.trialSession,
  },
  ({ trialSession }) => {
    const trialSessionTitle = trialSession.trialLocation;

    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Try Again"
        preventCancelOnBlur={true}
        title="File Compression Error"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="batchDownloadTrialSessionSequence"
      >
        <p>
          An error occurred during the file compression of “{trialSessionTitle}”
          trial session. Do you want to try again?
        </p>
      </ConfirmModal>
    );
  },
);
