import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import React from 'react';

export const AddEditNoteModal = (
  <ConfirmModal
    cancelLabel="Cancel"
    confirmLabel="Save"
    title="Add/Edit Notes"
    onCancelSequence="clearModalSequence"
    onConfirmSequence="updateCaseWorkingCopyNoteSequence"
  >
    <div className="usa-form-group">
      <label className="usa-label" htmlFor="case-notes">
        Judge's Notes
      </label>
      <BindedTextarea ariaLabel="notes" bind="modal.notes" id="case-notes" />
    </div>
  </ConfirmModal>
);
