import { sequences, state } from 'cerebral';

import { ModalDialog } from '../ModalDialog';
import React from 'react';
import { connect } from '@cerebral/react';

class CreateMessageModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Send',
      title: 'Create Message',
    };
  }
  renderBody() {
    return (
      <form>
        <div className="usa-form-group">
          <label htmlFor="section">Section</label>

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
                section: e.target.value,
              });
            }}
          >
            <option value="">- Select -</option>
            {this.props.constants.SECTIONS.map(section => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        <div className="usa-form-group">
          <label htmlFor="recipient">Select Recipient</label>
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
            }}
          >
            <option value="">- Select -</option>
            {this.props.users.map(user => (
              <option key={user.userId} value={user.userId}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="usa-form-group">
          <label htmlFor="message">Add Message</label>
          <textarea
            name="message"
            id="message"
            onChange={e => {
              this.props.updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>
      </form>
    );
  }
}

export const CreateMessageModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.createWorkItemSequence,
    constants: state.constants,
    form: state.form,
    getUsersInSectionSequence: sequences.getUsersInSectionSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    users: state.users,
  },
  CreateMessageModalDialogComponent,
);
