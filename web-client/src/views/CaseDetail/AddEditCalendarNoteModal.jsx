import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddEditCalendarNoteModal = connect(
  {
    validateTrialSessionNoteSequence:
      sequences.validateTrialSessionNoteSequence,
    validationErrors: state.validationErrors,
  },
  function AddEditCalendarNoteModal({
    onConfirmSequence,
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
        title="Add/Edit Calendar Note"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence={onConfirmSequence}
        onDeleteSequence={() => {
          console.log('delete!');
        }}
      >
        <FormGroup
          className="margin-bottom-2"
          errorText={validationErrors.calendarNotes}
        >
          <BindedTextarea
            aria-label="note"
            bind="modal.note"
            id="calendar-note"
            onBlur={() => validateTrialSessionNoteSequence()}
            onChange={() => {
              validateTrialSessionNoteSequence();
            }}
          />
        </FormGroup>
      </ConfirmModal>
    );
  },
);
