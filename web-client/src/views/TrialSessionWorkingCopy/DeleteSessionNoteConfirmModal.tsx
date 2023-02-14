import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import React from 'react';

export const DeleteSessionNoteConfirmModal = () => (
  <ConfirmModal
    noCloseBtn
    cancelLabel="No, Cancel"
    confirmLabel="Yes, Delete"
    preventCancelOnBlur={true}
    title="Are You Sure You Want to Delete This Note?"
    onCancelSequence="clearModalSequence"
    onConfirmSequence="deleteWorkingCopySessionNoteSequence"
  >
    <p>This action cannot be undone.</p>
  </ConfirmModal>
);

DeleteSessionNoteConfirmModal.displayName = 'DeleteSessionNoteConfirmModal';
