import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { MessageModalAttachments } from './MessageModalAttachments';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ReplyToMessageModalDialog = connect(
  {
    form: state.modal.form,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateCreateMessageInModalSequence:
      sequences.validateCreateMessageInModalSequence,
    validationErrors: state.validationErrors,
  },
  function ReplyToMessageModalDialog({
    form,
    updateModalValueSequence,
    validateCreateMessageInModalSequence,
    validationErrors,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Send"
        preventCancelOnBlur={true}
        title="Reply to Message"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="replyToMessageSequence"
      >
        <FormGroup>
          <span className="usa-label">Recipient</span>
          <span>{form.to}</span>
        </FormGroup>

        <FormGroup errorText={validationErrors.subject}>
          <label className="usa-label" htmlFor="subject">
            Subject line
          </label>
          <input
            className="usa-input"
            id="subject"
            name="form.subject"
            type="text"
            value={form.subject || ''}
            onChange={e => {
              updateModalValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateMessageInModalSequence();
            }}
          />
        </FormGroup>

        <FormGroup errorText={validationErrors.message}>
          <label className="usa-label" htmlFor="message">
            Add message
          </label>
          <textarea
            className="usa-textarea ustc-message-modal-text-area"
            id="message"
            name="form.message"
            onChange={e => {
              updateModalValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateMessageInModalSequence();
            }}
          />
        </FormGroup>

        <MessageModalAttachments />
      </ConfirmModal>
    );
  },
);

ReplyToMessageModalDialog.displayName = 'ReplyToMessageModalDialog';
