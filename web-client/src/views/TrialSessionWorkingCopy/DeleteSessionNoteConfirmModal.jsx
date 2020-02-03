import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import React from 'react';

export const DeleteSessionNoteConfirmModal = () => (
  <ConfirmModal
    noCloseBtn
    cancelLabel="No, Cancel"
    confirmLabel="Yes, Delete"
    preventCancelOnBlur={true}
    title="Are you sure you want to delete this note?"
    onCancelSequence="clearModalSequence"
    onConfirmSequence="deleteWorkingCopySessionNoteSequence"
  >
    <p>This action cannot be undone.</p>
  </ConfirmModal>
);
