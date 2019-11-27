import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import React from 'react';

export const FileCompressionErrorModal = connect(
  {},
  ({ onConfirmSequence }) => {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Yes, Leave"
        preventCancelOnBlur={true}
        title="Are you sure you want to leave?"
        onCancelSequence="clearModalSequence"
        onConfirmSequence={onConfirmSequence}
      >
        <p>
          You have files compression in progress. Leaving the site will cancel
          this process. Do you want to continue?
        </p>
      </ConfirmModal>
    );
  },
);
