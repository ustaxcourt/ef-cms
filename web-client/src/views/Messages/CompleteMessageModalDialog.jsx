import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const CompleteMessageModalDialog = connect(
  { updateModalValueSequence: sequences.updateModalValueSequence },
  function CompleteMessageModalDialog({ updateModalValueSequence }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Complete"
        preventCancelOnBlur={true}
        title="Complete Message"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="completeMessageSequence"
      >
        <FormGroup>
          <label className="usa-label" htmlFor="message">
            Add comment <span className="usa-hint">(optional)</span>
          </label>
          <textarea
            className="usa-textarea"
            id="message"
            name="form.message"
            onChange={e => {
              updateModalValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
      </ConfirmModal>
    );
  },
);

CompleteMessageModalDialog.displayName = 'CompleteMessageModalDialog';
