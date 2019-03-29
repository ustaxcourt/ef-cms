import { sequences, state } from 'cerebral';

import { ModalDialog } from '../ModalDialog';
import React from 'react';
import { connect } from '@cerebral/react';

class SelectDocumentTypeModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.preventCancelOnBlur = true;
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Select',
      title: 'Select Document Type',
    };
  }
  renderBody() {
    return (
      <div className="ustc-select-document-modal">
        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.section ? 'usa-input-error' : '')
          }
        >
          <label htmlFor="category">Document Category</label>

          <select
            className="usa-input-inline"
            id="category"
            name="category"
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
          <label htmlFor="documentType">Document Type</label>
          <fieldset
            className="usa-input-inline"
            id="documentType"
            name="documentType"
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
            {this.props.users.map(user => (
              <label key={user.userId} htmlFor={`type-${user.userId}`}>
                <input
                  type="radio"
                  id={`type-${user.userId}`}
                  value={user.userId}
                />
                {user.name}
              </label>
            ))}
          </fieldset>
          <div className="usa-input-error-message beneath">
            {this.props.validationErrors.assigneeId}
          </div>
        </div>
      </div>
    );
  }
}

export const SelectDocumentTypeModalDialog = connect(
  {
    cancelSequence: sequences.dismissCreateMessageModalSequence,
    confirmSequence: sequences.createWorkItemSequence,
    constants: state.constants,
    validationErrors: state.validationErrors,
  },
  SelectDocumentTypeModalDialogComponent,
);
