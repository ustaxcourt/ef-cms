import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const DeleteCaseNoteConfirmModal = connect(
  {},
  function DeleteCaseNoteConfirmModal({ onConfirmSequence }) {
    return (
      <ConfirmModal
        noCloseBtn
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Delete"
        preventCancelOnBlur={true}
        title="Are You Sure You Want to Delete This Note?"
        onCancelSequence="clearModalSequence"
        onConfirmSequence={onConfirmSequence}
      >
        <p>This action cannot be undone.</p>
      </ConfirmModal>
    );
  },
);

DeleteCaseNoteConfirmModal.displayName = 'DeleteCaseNoteConfirmModal';
