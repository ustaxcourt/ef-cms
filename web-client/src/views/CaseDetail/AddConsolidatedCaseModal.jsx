import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import React from 'react';

export const AddConsolidatedCaseModal = () => (
  <ConfirmModal
    cancelLabel="Cancel"
    confirmLabel="Consolidate cases"
    preventCancelOnBlur={true}
    showModalWhen="AddConsolidatedCaseModal"
    title="Consolidate Cases"
    onCancelSequence="clearModalSequence"
    onConfirmSequence="clearModalSequence"
  >
    <p>Please Enter A Case Number.</p>
  </ConfirmModal>
);
