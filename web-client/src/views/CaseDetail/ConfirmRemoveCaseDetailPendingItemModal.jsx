import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const ConfirmRemoveCaseDetailPendingItemModal = connect(
  {
    documentTitle: state.modal.documentTitle,
  },
  function ConfirmRemoveCaseDetailPendingItemModal({ documentTitle }) {
    return (
      <ConfirmModal
        cancelLabel="No, Take Me Back"
        confirmLabel="Yes, Continue"
        preventCancelOnBlur={true}
        title={`Remove ${documentTitle} From Pending Report`}
        onCancelSequence="clearModalSequence"
        onConfirmSequence="removeCaseDetailPendingItemSequence"
      >
        <p>Are you sure you want to remove this from the Pending Report?</p>
      </ConfirmModal>
    );
  },
);

ConfirmRemoveCaseDetailPendingItemModal.displayName =
  'ConfirmRemoveCaseDetailPendingItemModal';
