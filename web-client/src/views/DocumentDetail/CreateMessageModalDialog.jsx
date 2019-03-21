import { sequences, state } from 'cerebral';

import { ModalDialog } from '../ModalDialog';
import React from 'react';
import { connect } from '@cerebral/react';

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
            (this.props.validationErrors.section ? 'usa-input-error' : '')
          }
        >
          <label htmlFor="section">Select Section</label>

          <select
            className="usa-input-inline"
            id="section"
            name="section"
            onChange={e => {
              this.props.updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              this.props.getUsersInSectionSequence({
                form: 'form',
                section: e.target.value,
              });
              this.props.validateInitialWorkItemMessageSequence();
            }}
          >
            <option value="">- Select -</option>
            {this.props.constants.SECTIONS.map(section => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
          <div className="usa-input-error-message beneath">
            {this.props.validationErrors.section}
          </div>
        </div>

        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.assigneeId ? 'usa-input-error' : '')
          }
        >
          <label htmlFor="assigneeId">Select Recipient</label>
          <select
            className="usa-input-inline"
            id="assigneeId"
            name="assigneeId"
            disabled={!this.props.form.section}
            aria-disabled={!this.props.form.section ? 'true' : 'false'}
            onChange={e => {
              this.props.updateFormValueSequence({
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
          <div className="usa-input-error-message beneath">
            {this.props.validationErrors.assigneeId}
          </div>
        </div>

        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.message ? 'usa-input-error' : '')
          }
        >
          <label htmlFor="message">Add Message</label>
          <textarea
            name="message"
            id="message"
            onChange={e => {
              this.props.updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              this.props.validateInitialWorkItemMessageSequence();
            }}
          />
          <div className="usa-input-error-message beneath">
            {this.props.validationErrors.message}
          </div>
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
    getUsersInSectionSequence: sequences.getUsersInSectionSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    users: state.users,
    validateInitialWorkItemMessageSequence:
      sequences.validateInitialWorkItemMessageSequence,
    validationErrors: state.validationErrors,
  },
  CreateMessageModalDialogComponent,
);
