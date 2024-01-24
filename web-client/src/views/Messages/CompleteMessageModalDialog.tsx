import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
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
            data-testid="complete-message-body"
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
