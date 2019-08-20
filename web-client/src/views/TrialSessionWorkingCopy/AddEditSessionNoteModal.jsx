import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classnames from 'classnames';

export const AddEditSessionNoteModal = connect(
  {
    modal: state.modal,
    validateCaseNoteSequence: sequences.validateCaseNoteSequence,
    validationErrors: state.validationErrors,
  },
  ({ modal, validateCaseNoteSequence, validationErrors }) => {
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
        <div
          className={classnames(
            'usa-form-group',
            validationErrors.notes && 'usa-form-group--error',
          )}
        >
          <label className="usa-label" htmlFor="case-notes">
            {"Judge's Notes"}
          </label>
          <BindedTextarea
            ariaLabel="notes"
            bind="modal.notes"
            id="case-notes"
            onChange={() => {
              validateCaseNoteSequence();
            }}
          />
          <Text bind="validationErrors.notes" className="usa-error-message" />
        </div>
      </ConfirmModal>
    );
  },
);
