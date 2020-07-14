import { CaseMessageModalAttachments } from './CaseMessageModalAttachments';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ForwardCaseMessageModalDialog = connect(
  {
    constants: state.constants,
    form: state.modal.form,
    showChambersSelect: state.modal.showChambersSelect,
    updateChambersInCreateCaseMessageModalSequence:
      sequences.updateChambersInCreateCaseMessageModalSequence,
    updateModalFormValueSequence: sequences.updateModalFormValueSequence,
    updateSectionInCreateCaseMessageModalSequence:
      sequences.updateSectionInCreateCaseMessageModalSequence,
    users: state.users,
    validateCreateCaseMessageInModalSequence:
      sequences.validateCreateCaseMessageInModalSequence,
    validationErrors: state.validationErrors,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  function ForwardCaseMessageModalDialog({
    constants,
    form,
    showChambersSelect,
    updateChambersInCreateCaseMessageModalSequence,
    updateModalFormValueSequence,
    updateSectionInCreateCaseMessageModalSequence,
    users,
    validateCreateCaseMessageInModalSequence,
    validationErrors,
    workQueueSectionHelper,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Send"
        preventCancelOnBlur={true}
        title="Forward Message"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="forwardCaseMessageSequence"
      >
        <FormGroup
          errorText={!showChambersSelect && validationErrors.toSection}
        >
          <label className="usa-label" htmlFor="toSection">
            Select a section
          </label>

          <select
            className="usa-select"
            id="toSection"
            name="toSection"
            onChange={e => {
              updateSectionInCreateCaseMessageModalSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateCaseMessageInModalSequence();
            }}
          >
            <option value="">- Select -</option>
            {constants.SECTIONS.map(section => (
              <option key={section} value={section}>
                {workQueueSectionHelper.sectionDisplay(section)}
              </option>
            ))}
          </select>
        </FormGroup>
        {showChambersSelect && (
          <FormGroup
            errorText={validationErrors.toSection && 'Select a chamber'}
          >
            <label className="usa-label" htmlFor="chambers">
              Select chambers
            </label>
            <select
              className="usa-select"
              id="chambers"
              name="chambers"
              onChange={e => {
                updateChambersInCreateCaseMessageModalSequence({
                  key: 'toSection',
                  value: e.target.value,
                });
                validateCreateCaseMessageInModalSequence();
              }}
            >
              <option value="">- Select -</option>
              {constants.CHAMBERS_SECTIONS.map(section => (
                <option key={section} value={section}>
                  {workQueueSectionHelper.chambersDisplay(section)}
                </option>
              ))}
            </select>
          </FormGroup>
        )}
        <FormGroup errorText={validationErrors.toUserId}>
          <label className="usa-label" htmlFor="toUserId">
            Select recipient
          </label>
          <select
            aria-disabled={!form.toSection ? 'true' : 'false'}
            className="usa-select"
            disabled={!form.toSection}
            id="toUserId"
            name="toUserId"
            onChange={e => {
              updateModalFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateCaseMessageInModalSequence();
            }}
          >
            <option value="">- Select -</option>
            {users.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.name}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup errorText={validationErrors.subject}>
          <label className="usa-label" htmlFor="subject">
            Subject line
          </label>
          <input
            className="usa-input"
            id="subject"
            name="subject"
            type="text"
            value={form.subject || ''}
            onChange={e => {
              updateModalFormValueSequence({
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
            name="message"
            onChange={e => {
              updateModalFormValueSequence({
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
