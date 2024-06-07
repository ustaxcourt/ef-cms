import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ConfirmRemoveCaseDetailPendingItemModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    documentTitle: state.modal.documentTitle,
    removeCaseDetailPendingItemSequence:
      sequences.removeCaseDetailPendingItemSequence,
  },
  function ConfirmRemoveCaseDetailPendingItemModal({
    clearModalSequence,
    documentTitle,
    removeCaseDetailPendingItemSequence,
  }) {
    return (
      <ConfirmModal
        cancelLabel="No, Take Me Back"
        confirmLabel="Yes, Continue"
        preventCancelOnBlur={true}
        title={`Remove ${documentTitle} From Pending Report`}
        onCancelSequence={clearModalSequence}
        onConfirmSequence={removeCaseDetailPendingItemSequence}
      >
        <p>Are you sure you want to remove this from the Pending Report?</p>
      </ConfirmModal>
    );
  },
);

ConfirmRemoveCaseDetailPendingItemModal.displayName =
  'ConfirmRemoveCaseDetailPendingItemModal';
