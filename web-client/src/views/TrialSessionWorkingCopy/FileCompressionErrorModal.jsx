import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import React from 'react';

export const FileCompressionErrorModal = connect(
  {},
  ({ filename, onConfirmSequence, trialSessionCity, trialSessionState }) => {
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
          An error occurred during the file compression of “{trialSessionCity},{' '}
          {trialSessionState}” trial session. {filename} {trialSessionState}. Do
          you want to try again?
        </p>
      </ConfirmModal>
    );
  },
);
