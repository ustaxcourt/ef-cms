import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

type DeleteCaseNoteConfirmModalProps = {
  onConfirmSequence: Function;
};

const deleteCaseNoteConfirmModalDeps = {
  clearModalSequence: sequences.clearModalSequence,
};

export const DeleteCaseNoteConfirmModal = connect<
  DeleteCaseNoteConfirmModalProps,
  typeof deleteCaseNoteConfirmModalDeps
>(
  deleteCaseNoteConfirmModalDeps,
  function DeleteCaseNoteConfirmModal({
    clearModalSequence,
    onConfirmSequence,
  }) {
    return (
      <ConfirmModal
        noCloseBtn
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Delete"
        title="Are You Sure You Want to Delete This Note?"
        onCancelSequence={clearModalSequence}
        onConfirmSequence={onConfirmSequence}
      >
        <p>This action cannot be undone.</p>
      </ConfirmModal>
    );
  },
);

DeleteCaseNoteConfirmModal.displayName = 'DeleteCaseNoteConfirmModal';
