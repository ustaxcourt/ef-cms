import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import React from 'react';

export const AddConsolidatedCaseModal = () => (
  <ConfirmModal
    noCloseBtn
    cancelLabel="No, cancel"
    confirmLabel="Yes, delete"
    preventCancelOnBlur={true}
    showModalWhen="AddConsolidatedCaseModal"
    title="Are you sure you want to delete this note?"
    onCancelSequence="clearModalSequence"
    onConfirmSequence="deleteWorkingCopySessionNoteSequence"
  >
    <p>This action cannot be undone.</p>
  </ConfirmModal>
);
