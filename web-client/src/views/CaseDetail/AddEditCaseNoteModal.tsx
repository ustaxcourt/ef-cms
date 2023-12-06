import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddEditCaseNoteModal = connect(
  {
    modal: state.modal,
    validateNoteSequence: sequences.validateNoteSequence,
    validationErrors: state.validationErrors,
  },
  function AddEditCaseNoteModal({
    modal,
    onConfirmSequence,
    validateNoteSequence,
    validationErrors,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="add-edit-procedural-note-modal"
        confirmLabel="Save"
        preventCancelOnBlur={true}
        title="Add/Edit Case Notes"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence={onConfirmSequence}
      >
        <h5 className="margin-bottom-4">
          {`Docket ${modal.docketNumber}: ${modal.caseTitle}`}
        </h5>
        <FormGroup
          className="margin-bottom-2"
          errorText={validationErrors.notes || validationErrors.caseNote}
        >
          <label className="usa-label" htmlFor="procedural-notes">
            Case note
          </label>
          <BindedTextarea
            aria-label="notes"
            bind="modal.notes"
            id="procedural-notes"
            onChange={() => {
              validateNoteSequence();
            }}
          />
        </FormGroup>
      </ConfirmModal>
    );
  },
);

AddEditCaseNoteModal.displayName = 'AddEditCaseNoteModal';
