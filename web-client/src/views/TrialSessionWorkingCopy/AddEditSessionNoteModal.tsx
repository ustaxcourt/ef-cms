import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddEditSessionNoteModal = connect(
  {
    modal: state.modal,
    validateNoteSequence: sequences.validateNoteSequence,
    validationErrors: state.validationErrors,
  },
  function AddEditSessionNoteModal({
    modal,
    validateNoteSequence,
    validationErrors,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="add-edit-note-modal"
        confirmLabel="Save"
        preventCancelOnBlur={true}
        title="Add/Edit Session Notes"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="updateWorkingCopySessionNoteSequence"
      >
        <h5 className="margin-bottom-4">{modal.heading}</h5>
        <FormGroup
          className="margin-bottom-2"
          errorText={validationErrors.notes}
        >
          <label className="usa-label" htmlFor="case-notes">
            {modal.notesLabel}
          </label>
          <BindedTextarea
            aria-label="notes"
            bind="modal.notes"
            id="case-notes"
            onChange={() => {
              validateNoteSequence();
            }}
          />
        </FormGroup>
      </ConfirmModal>
    );
  },
);

AddEditSessionNoteModal.displayName = 'AddEditSessionNoteModal';
