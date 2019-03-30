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
            (this.props.validationErrors.category ? 'usa-input-error' : '')
          }
        >
          <label htmlFor="category">Document Category</label>

          <select
            className="usa-input-inline"
            id="category"
            name="category"
            value={this.props.form.category}
            onChange={e => {
              this.props.updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              this.props.updateFormValueSequence({
                key: 'modalDocumentType',
                value: undefined,
              });
            }}
          >
            <option value="">- Select -</option>
            {this.props.constants.CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="usa-input-error-message beneath">
            {this.props.validationErrors.category}
          </div>
        </div>

        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.modalDocumentType
              ? 'usa-input-error'
              : '')
          }
        >
          <label htmlFor="documentType">Document Type</label>
          <select
            size="2"
            className="ustc-select-multi"
            id="modalDocumentType"
            name="modalDocumentType"
            aria-label="Document type"
            value={this.props.form.modalDocumentType}
            disabled={!this.props.form.category}
            aria-disabled={!this.props.form.category ? 'true' : 'false'}
            onChange={e => {
              this.props.updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          >
            {(
              this.props.constants.CATEGORY_MAP[this.props.form.category] || []
            ).map(documentType => (
              <option
                key={documentType.documentTitle}
                value={documentType.documentTitle}
              >
                {documentType.documentTitle}
              </option>
            ))}
          </select>
          <div className="usa-input-error-message beneath">
            {this.props.validationErrors.modalDocumentType}
          </div>
        </div>
      </div>
    );
  }
}

export const SelectDocumentTypeModalDialog = connect(
  {
    cancelSequence: sequences.dismissSelectDocumentTypeModalSequence,
    confirmSequence: sequences.selectDocumentSequence,
    constants: state.constants,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    users: state.users,
    validationErrors: state.validationErrors,
  },
  SelectDocumentTypeModalDialogComponent,
);
