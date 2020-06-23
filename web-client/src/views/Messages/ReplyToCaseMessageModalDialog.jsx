import { CaseMessageModalAttachments } from './CaseMessageModalAttachments';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ReplyToCaseMessageModalDialog = connect(
  {
    form: state.modal.form,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateCreateCaseMessageInModalSequence:
      sequences.validateCreateCaseMessageInModalSequence,
    validationErrors: state.validationErrors,
  },
  function ReplyToCaseMessageModalDialog({
    form,
    updateModalValueSequence,
    validateCreateCaseMessageInModalSequence,
    validationErrors,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Send"
        preventCancelOnBlur={true}
        title="Reply to Message"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="replyToCaseMessageSequence"
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
              validateCreateCaseMessageInModalSequence();
            }}
          />
        </FormGroup>

        <FormGroup errorText={validationErrors.message}>
          <label className="usa-label" htmlFor="message">
            Add message
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
              validateCreateCaseMessageInModalSequence();
            }}
          />
        </FormGroup>

        <CaseMessageModalAttachments />
      </ConfirmModal>
    );
  },
);
