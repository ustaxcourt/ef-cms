import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classnames from 'classnames';

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
        className="add-edit-note-modal"
        confirmLabel="Save"
        preventCancelOnBlur={true}
        title="Add/Edit Notes"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence={onConfirmSequence}
      >
        <h5 className="margin-bottom-4">
          Docket {modal.docketNumber}: {modal.caseCaptionNames}
        </h5>
        <div
          className={classnames(
            'usa-form-group',
            validationErrors.notes && 'usa-form-group--error',
          )}
        >
          <label className="usa-label" htmlFor="case-notes">
            {'Judge’s Notes'}
          </label>
          <BindedTextarea
            ariaLabel="notes"
            bind="modal.notes"
            id="case-notes"
            onChange={() => {
              validateNoteSequence();
            }}
          />
          <Text bind="validationErrors.notes" className="usa-error-message" />
        </div>
      </ConfirmModal>
    );
  },
);
