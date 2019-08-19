import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import React from 'react';

export const DeleteCaseNoteConfirmModal = () => (
  <ConfirmModal
    noCloseBtn
    cancelLabel="No, cancel"
    confirmLabel="Yes, delete"
    title="Are you sure you want to delete this note?"
    onCancelSequence="clearModalSequence"
    onConfirmSequence="deleteCaseWorkingCopyNoteSequence"
  >
    <p>This action cannot be undone.</p>
  </ConfirmModal>
);
