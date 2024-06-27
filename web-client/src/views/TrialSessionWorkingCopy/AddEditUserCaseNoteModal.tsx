import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type AddEditUserCaseNoteModalProps = {
  onConfirmSequence: Function;
};

const addEditUserCaseNoteModalDeps = {
  clearModalFormSequence: sequences.clearModalFormSequence,
  modal: state.modal,
  validateNoteSequence: sequences.validateNoteSequence,
  validationErrors: state.validationErrors,
};

export const AddEditUserCaseNoteModal = connect<
  AddEditUserCaseNoteModalProps,
  typeof addEditUserCaseNoteModalDeps
>(
  addEditUserCaseNoteModalDeps,
  function AddEditUserCaseNoteModal({
    clearModalFormSequence,
    modal,
    onConfirmSequence,
    validateNoteSequence,
    validationErrors,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="add-edit-note-modal"
        confirmLabel="Save"
        title="Add/Edit Notes"
        onCancelSequence={clearModalFormSequence}
        onConfirmSequence={onConfirmSequence}
      >
        <h5 className="margin-bottom-4">
          Docket {modal.docketNumberWithSuffix}: {modal.caseTitle}
        </h5>
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
            data-testid="case-notes"
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

AddEditUserCaseNoteModal.displayName = 'AddEditUserCaseNoteModal';
