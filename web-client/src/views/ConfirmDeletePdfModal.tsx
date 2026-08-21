import { ConfirmModal } from '../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

type ConfirmDeletePDFModalProps = {
  cancelLabel?: string;
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
    cancelLabel = 'No, Keep Current PDF',
    clearModalSequence,
    confirmSequence,
    confirmText,
    modalContent,
    title,
  }) {
    return (
      <ConfirmModal
        cancelLabel={cancelLabel}
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
