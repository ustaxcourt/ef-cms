import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class CreateMessageModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.preventCancelOnBlur = true;
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Send',
      title: 'Create Message',
    };
  }
  renderBody() {
    return (
      <div className="ustc-create-message-modal">
        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.section &&
            !this.props.modal.showChambersSelect
              ? 'usa-form-group--error'
              : '')
          }
        >
          <label className="usa-label" htmlFor="section">
            Select section
          </label>

          <select
            className="usa-select"
            id="section"
            name="section"
            onChange={e => {
              this.props.updateMessageValueSequence({
                form: 'form',
                key: e.target.name,
                section: e.target.value,
                value: e.target.value,
              });
              this.props.validateInitialWorkItemMessageSequence();
            }}
          >
            <option value="">- Select -</option>
            {this.props.constants.SECTIONS.map(section => (
              <option key={section} value={section}>
                {this.props.workQueueSectionHelper.sectionDisplay(section)}
              </option>
            ))}
          </select>
          {!this.props.modal.showChambersSelect &&
            this.props.validationErrors.section && (
              <div className="usa-error-message beneath">
                {this.props.validationErrors.section}
              </div>
            )}
        </div>
        {this.props.modal.showChambersSelect && (
          <div
            className={
              'usa-form-group ' +
              (this.props.validationErrors.section
                ? 'usa-form-group--error'
                : '')
            }
          >
            <label className="usa-label" htmlFor={'chambers'}>
              Select chambers
            </label>
            <select
              className="usa-select"
              id="chambers"
              name="chambers"
              onChange={e => {
                this.props.updateMessageValueSequence({
                  form: 'form',
                  key: e.target.name,
                  section: e.target.value,
                  value: e.target.value,
                });
                this.props.validateInitialWorkItemMessageSequence();
              }}
            >
              <option value="">- Select -</option>
              {this.props.constants.CHAMBERS_SECTIONS.map(section => (
                <option key={section} value={section}>
                  {this.props.workQueueSectionHelper.chambersDisplay(section)}
                </option>
              ))}
            </select>
            {this.props.validationErrors.section && (
              <div className="usa-error-message beneath">
                Chambers is required.
              </div>
            )}
          </div>
        )}
        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.assigneeId
              ? 'usa-form-group--error'
              : '')
          }
        >
          <label className="usa-label" htmlFor="assigneeId">
            Select recipient
          </label>
          <select
            aria-disabled={!this.props.form.section ? 'true' : 'false'}
            className="usa-select"
            disabled={!this.props.form.section}
            id="assigneeId"
            name="assigneeId"
            onChange={e => {
              this.props.updateMessageValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              this.props.validateInitialWorkItemMessageSequence();
            }}
          >
            <option value="">- Select -</option>
            {this.props.users.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.name}
              </option>
            ))}
          </select>
          {this.props.validationErrors.assigneeId && (
            <div className="usa-error-message beneath">
              {this.props.validationErrors.assigneeId}
            </div>
          )}
        </div>

        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.message ? 'usa-form-group--error' : '')
          }
        >
          <label className="usa-label" htmlFor="message">
            Add message
          </label>
          <textarea
            className="usa-textarea"
            id="message"
            name="message"
            onChange={e => {
              this.props.updateMessageValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              this.props.validateInitialWorkItemMessageSequence();
            }}
          />
          {this.props.validationErrors.message && (
            <div className="usa-error-message beneath">
              {this.props.validationErrors.message}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export const CreateMessageModalDialog = connect(
  {
    cancelSequence: sequences.dismissCreateMessageModalSequence,
    confirmSequence: sequences.createWorkItemSequence,
    constants: state.constants,
    form: state.form,
    modal: state.modal,
    updateMessageValueSequence: sequences.updateMessageValueSequence,
    users: state.users,
    validateInitialWorkItemMessageSequence:
      sequences.validateInitialWorkItemMessageSequence,
    validationErrors: state.validationErrors,
    workQueueSectionHelper: state.workQueueSectionHelper,
  },
  CreateMessageModalDialogComponent,
);
