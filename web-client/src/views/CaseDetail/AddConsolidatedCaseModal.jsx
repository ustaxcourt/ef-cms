import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { ModalCaseSearchBox } from './ModalCaseSearchBox';
import React from 'react';

export const AddConsolidatedCaseModal = () => (
  <ConfirmModal
    cancelLabel="Cancel"
    className="add-consolidated-case-search-modal"
    confirmLabel="Consolidate cases"
    preventCancelOnBlur={true}
    showModalWhen="AddConsolidatedCaseModal"
    title="Consolidate Cases"
    onCancelSequence="clearModalSequence"
    onConfirmSequence="clearModalSequence"
  >
    <ModalCaseSearchBox />
    <p>Please Enter A Case Number.</p>
  </ConfirmModal>
);
