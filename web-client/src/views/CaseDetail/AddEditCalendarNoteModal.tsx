import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddEditCalendarNoteModal = connect(
  {
    isEditing: state.modal.isEditing,
    validateTrialSessionNoteSequence:
      sequences.validateTrialSessionNoteSequence,
    validationErrors: state.validationErrors,
  },
  function AddEditCalendarNoteModal({
    isEditing,
    validateTrialSessionNoteSequence,
    validationErrors,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="add-edit-calendar-note-modal"
        confirmLabel="Save"
        deleteLabel="Delete Note"
        preventCancelOnBlur={true}
        showDelete={isEditing}
        title="Add/Edit Calendar Note"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="updateCalendarNoteSequence"
        onDeleteSequence="deleteCalendarNoteSequence"
      >
        <FormGroup
          className="margin-bottom-2"
          errorText={validationErrors.note}
        >
          <BindedTextarea
            aria-label="note"
            bind="modal.note"
            className="resize-vertical-only"
            id="calendar-note"
            onBlur={() => validateTrialSessionNoteSequence()}
          />
        </FormGroup>
      </ConfirmModal>
    );
  },
);

AddEditCalendarNoteModal.displayName = 'AddEditCalendarNoteModal';
