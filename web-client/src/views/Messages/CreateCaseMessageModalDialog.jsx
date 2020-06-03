import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreateCaseMessageModalDialog = connect(
  {
    constants: state.constants,
    form: state.modal.form,
    showChambersSelect: state.modal.showChambersSelect,
    updateMessageValueInModalSequence:
      sequences.updateMessageValueInModalSequence,
    users: state.users,
    validateCreateCaseMessageInModalSequence:
      sequences.validateCreateCaseMessageInModalSequence,
    validationErrors: state.modal.validationErrors,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  function CreateMessageModalDialog({
    constants,
    form,
    onConfirmSequence = 'createWorkItemSequence',
    showChambersSelect,
    updateMessageValueInModalSequence,
    users,
    validateCreateCaseMessageInModalSequence,
    validationErrors,
    workQueueSectionHelper,
  }) {
    validationErrors = validationErrors || {};
    form = form || {};

    return (
      <ConfirmModal
        cancelLabel="Cancel"
        className="ustc-create-message-modal"
        confirmLabel="Send"
        preventCancelOnBlur={true}
        title="Create Message"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence={onConfirmSequence}
      >
        <FormGroup errorText={!showChambersSelect && validationErrors.section}>
          <label className="usa-label" htmlFor="section">
            Select a section
          </label>

          <select
            className="usa-select"
            id="section"
            name="section"
            onChange={e => {
              updateMessageValueInModalSequence({
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
          <FormGroup errorText={validationErrors.section && 'Select a chamber'}>
            <label className="usa-label" htmlFor="chambers">
              Select chambers
            </label>
            <select
              className="usa-select"
              id="chambers"
              name="chambers"
              onChange={e => {
                updateMessageValueInModalSequence({
                  key: e.target.name,
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

        <FormGroup errorText={validationErrors.assigneeId}>
          <label className="usa-label" htmlFor="assigneeId">
            Select recipient
          </label>
          <select
            aria-disabled={!form.section ? 'true' : 'false'}
            className="usa-select"
            disabled={!form.section}
            id="assigneeId"
            name="assigneeId"
            onChange={e => {
              updateMessageValueInModalSequence({
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
            onChange={e => {
              updateMessageValueInModalSequence({
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
              updateMessageValueInModalSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateCreateCaseMessageInModalSequence();
            }}
          />
        </FormGroup>
      </ConfirmModal>
    );
  },
);
