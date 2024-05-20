import { ConfirmModal } from '../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

type ConfirmDeletePDFModalProps = {
  confirmText: string;
  modalContent: string;
  title: string;
  confirmSequence: Function;
};

const confirmDeletePDFModal = {
  clearModalSequence: sequences.clearModalSequence,
};

export const ConfirmDeletePDFModal = connect<
  ConfirmDeletePDFModalProps,
  typeof confirmDeletePDFModal
>(
  confirmDeletePDFModal,
  function ConfirmDeletePDFModal({
    clearModalSequence,
    confirmSequence,
    confirmText,
    modalContent,
    title,
  }) {
    return (
      <ConfirmModal
        cancelLabel="No, Cancel"
        confirmLabel={confirmText}
        title={title}
        onCancelSequence={clearModalSequence}
        onConfirmSequence={confirmSequence}
      >
        {modalContent}
      </ConfirmModal>
    );
  },
);

ConfirmDeletePDFModal.displayName = 'ConfirmDeletePDFModal';
