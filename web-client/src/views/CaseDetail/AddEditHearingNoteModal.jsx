import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddEditHearingNoteModal = connect(
  {
    validateTrialSessionHearingNoteSequence:
      sequences.validateTrialSessionHearingNoteSequence,
    validationErrors: state.validationErrors,
  },
  function AddEditHearingNoteModal({
    validateTrialSessionHearingNoteSequence,
    validationErrors,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="add-edit-calendar-note-modal"
        confirmLabel="Save"
        preventCancelOnBlur={true}
        title="Add/Edit Hearing Note"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="updateHearingNoteSequence"
      >
        <FormGroup
          className="margin-bottom-2"
          errorText={validationErrors.note}
        >
          <BindedTextarea
            aria-label="note"
            bind="modal.note"
            id="hearing-note"
            onBlur={() => validateTrialSessionHearingNoteSequence()}
          />
        </FormGroup>
      </ConfirmModal>
    );
  },
);
