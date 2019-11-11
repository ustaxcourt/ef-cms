import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import React from 'react';

export const ConfirmRemoveCaseDetailPendingItemModal = () => (
  <ConfirmModal
    cancelLabel="No, take me back"
    confirmLabel="Yes, continue"
    preventCancelOnBlur={true}
    title="Remove Filings and Proceedings from Pending Report"
    onCancelSequence="clearModalSequence"
    onConfirmSequence="removeCaseDetailPendingItemSequence"
  >
    <p>Are you sure you want to remove this from the Pending Report?</p>
  </ConfirmModal>
);
