import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddEditCaseNoteModal = connect(
  {
    modal: state.modal,
    validateNoteSequence: sequences.validateNoteSequence,
    validationErrors: state.validationErrors,
  },
  ({ modal, onConfirmSequence, validateNoteSequence, validationErrors }) => {
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
          {`Docket ${modal.docketNumber}: ${modal.caseCaptionNames}`}
        </h5>
        <FormGroup
          className="margin-bottom-2"
          errorText={validationErrors.notes}
        >
          <label className="usa-label" htmlFor="procedural-notes">
            Case note
          </label>
          <BindedTextarea
            ariaLabel="notes"
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
