import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import React from 'react';

export const DeletePractitionerDocumentConfirmModal = ({
  onConfirmSequence,
}) => (
  <ConfirmModal
    cancelLabel="No, Cancel"
    confirmLabel="Yes, Delete"
    preventCancelOnBlur={true}
    title="Are You Sure You Want to Delete This Document?"
    onCancelSequence="clearModalSequence"
    onConfirmSequence={onConfirmSequence}
  >
    <p>This action cannot be undone.</p>
  </ConfirmModal>
);

DeletePractitionerDocumentConfirmModal.displayName =
  'DeletePractitionerDocumentConfirmModal';
