import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DeleteCorrespondenceModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    correspondenceTitle: state.modal.correspondenceToDelete.documentTitle,
    deleteCorrespondenceDocumentSequence:
      sequences.deleteCorrespondenceDocumentSequence,
  },
  function DeleteCorrespondenceModal({
    clearModalSequence,
    correspondenceTitle,
    deleteCorrespondenceDocumentSequence,
  }) {
    return (
      <ConfirmModal
        cancelLabel="No, Take me back"
        confirmLabel="Yes, Delete"
        title={'Are You Sure You Want to Delete This Document?'}
        onCancelSequence={clearModalSequence}
        onConfirmSequence={deleteCorrespondenceDocumentSequence}
      >
        <div className="padding-bottom-1">
          Once deleted, it can’t be restored.
        </div>
        <span className="padding-bottom-1">
          <strong>{correspondenceTitle}</strong>
        </span>
      </ConfirmModal>
    );
  },
);

DeleteCorrespondenceModal.displayName = 'DeleteCorrespondenceModal';
