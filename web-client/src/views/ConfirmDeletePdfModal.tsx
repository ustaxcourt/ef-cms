import { ConfirmModal } from '../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import React from 'react';

export const ConfirmDeletePDFModal = connect(
  {
    confirmSequence: props.confirmSequence,
    confirmText: props.confirmText,
    modalContent: props.modalContent,
    title: props.title,
  },
  function ConfirmDeletePDFModal({
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
        onCancelSequence="clearModalSequence"
        onConfirmSequence={confirmSequence}
      >
        {modalContent}
      </ConfirmModal>
    );
  },
);

ConfirmDeletePDFModal.displayName = 'ConfirmDeletePDFModal';
