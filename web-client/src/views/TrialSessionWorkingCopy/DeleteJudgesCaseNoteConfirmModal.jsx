import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import React from 'react';

export const DeleteJudgesCaseNoteConfirmModal = connect(
  {},
  ({ onConfirmSequence }) => (
    <ConfirmModal
      noCloseBtn
      cancelLabel="No, Cancel"
      confirmLabel="Yes, Delete"
      preventCancelOnBlur={true}
      title="Are you sure you want to delete this note?"
      onCancelSequence="clearModalSequence"
      onConfirmSequence={onConfirmSequence}
    >
      <p>This action cannot be undone.</p>
    </ConfirmModal>
  ),
);
