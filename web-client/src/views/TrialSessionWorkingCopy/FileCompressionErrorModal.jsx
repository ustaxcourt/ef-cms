import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const FileCompressionErrorModal = connect(
  {
    trialSessionWorkingCopyHelper: state.trialSessionWorkingCopyHelper,
  },
  ({ onConfirmSequence, trialSessionWorkingCopyHelper }) => {
    const trialSessionTitle = trialSessionWorkingCopyHelper;

    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Try Again"
        preventCancelOnBlur={true}
        title="File Compression Error"
        onCancelSequence="clearModalSequence"
        onConfirmSequence={onConfirmSequence}
      >
        <p>
          An error occurred during the file compression of “{trialSessionTitle},{' '}
          {trialSessionTitle}” trial session. Do you want to try again?
        </p>
      </ConfirmModal>
    );
  },
);
