import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const CreateMessageModalDialog = connect(
  {
    constants: state.constants,
    form: state.modal.form,
    showChambersSelect: state.modal.showChambersSelect,
    updateMessageValueInModalSequence:
      sequences.updateMessageValueInModalSequence,
    users: state.users,
    validateInitialWorkItemMessageInModalSequence:
      sequences.validateInitialWorkItemMessageInModalSequence,
    validationErrors: state.modal.validationErrors,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  ({
    constants,
    form,
    onConfirmSequence = 'createWorkItemSequence',
    showChambersSelect,
    updateMessageValueInModalSequence,
    users,
    validateInitialWorkItemMessageInModalSequence,
    validationErrors,
    workQueueSectionHelper,
  }) => {
    validationErrors = validationErrors || {};
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
        <div
          className={classNames(
            'usa-form-group',
            validationErrors.section &&
              !showChambersSelect &&
              'usa-form-group--error',
          )}
        >
          <label className="usa-label" htmlFor="section">
            Select section
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
              validateInitialWorkItemMessageInModalSequence();
            }}
          >
            <option value="">- Select -</option>
            {constants.SECTIONS.map(section => (
              <option key={section} value={section}>
                {workQueueSectionHelper.sectionDisplay(section)}
              </option>
            ))}
          </select>
          {!showChambersSelect && validationErrors.section && (
            <div className="usa-error-message beneath">
              {validationErrors.section}
            </div>
          )}
        </div>

        {showChambersSelect && (
          <div
            className={classNames(
              'usa-form-group',
              validationErrors.section && 'usa-form-group--error',
            )}
          >
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
                validateInitialWorkItemMessageInModalSequence();
              }}
            >
              <option value="">- Select -</option>
              {constants.CHAMBERS_SECTIONS.map(section => (
                <option key={section} value={section}>
                  {workQueueSectionHelper.chambersDisplay(section)}
                </option>
              ))}
            </select>
            {validationErrors.section && (
              <div className="usa-error-message beneath">
                Chambers is required.
              </div>
            )}
          </div>
        )}

        <div
          className={classNames(
            'usa-form-group',
            validationErrors.assigneeId && 'usa-form-group--error',
          )}
        >
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
              validateInitialWorkItemMessageInModalSequence();
            }}
          >
            <option value="">- Select -</option>
            {users.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.name}
              </option>
            ))}
          </select>
          {validationErrors.assigneeId && (
            <div className="usa-error-message beneath">
              {validationErrors.assigneeId}
            </div>
          )}
        </div>

        <div
          className={classNames(
            'usa-form-group',
            validationErrors.message && 'usa-form-group--error',
          )}
        >
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
              validateInitialWorkItemMessageInModalSequence();
            }}
          />
          {validationErrors.message && (
            <div className="usa-error-message beneath">
              {validationErrors.message}
            </div>
          )}
        </div>
      </ConfirmModal>
    );
  },
);
