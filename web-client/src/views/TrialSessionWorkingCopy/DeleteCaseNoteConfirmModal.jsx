import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import React from 'react';

export const DeleteCaseNoteConfirmModal = connect(
  {},
  ({ onConfirmSequence }) => (
    <ConfirmModal
      noCloseBtn
      cancelLabel="No, cancel"
      confirmLabel="Yes, delete"
      preventCancelOnBlur={true}
      title="Are you sure you want to delete this note?"
      onCancelSequence="clearModalSequence"
      onConfirmSequence={onConfirmSequence}
    >
      <p>This action cannot be undone.</p>
    </ConfirmModal>
  ),
);
