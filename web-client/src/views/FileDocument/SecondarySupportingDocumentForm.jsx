import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondarySupportingDocumentForm = connect(
  {
    addSupportingDocumentToFormSequence:
      sequences.addSupportingDocumentToFormSequence,
    constants: state.constants,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationErrors: state.validationErrors,
  },
  ({
    addSupportingDocumentToFormSequence,
    constants,
    fileDocumentHelper,
    form,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
    validationErrors,
  }) => {
    return (
      <>
        <button
          className="usa-button usa-button--outline margin-top-205"
          onClick={() => {
            addSupportingDocumentToFormSequence({ type: 'secondary' });
          }}
        >
          <FontAwesomeIcon
            className="margin-right-05"
            icon="plus-circle"
            size="1x"
          />
          Add Secondary Supporting Document
        </button>

        {form.hasSecondarySupportingDocuments && (
          <>
            <h2 className="margin-top-4">Secondary Supporting Document 1</h2>
            <div className="blue-container">
              <div
                className={`usa-form-group ${
                  validationErrors.secondarySupportingDocument
                    ? 'usa-form-group--error'
                    : ''
                } ${
                  !form.secondarySupportingDocument ? 'margin-bottom-0' : ''
                }`}
              >
                <label
                  className="usa-label"
                  htmlFor="secondary-supporting-document"
                  id="secondary-supporting-document-label"
                >
                  Select Supporting Document
                </label>
                <select
                  aria-describedby="secondary-supporting-document-label"
                  className={`usa-select ${
                    validationErrors.secondarySupportingDocument
                      ? 'usa-select--error'
                      : ''
                  }`}
                  id="secondary-supporting-document"
                  name="secondarySupportingDocument"
                  value={form.secondarySupportingDocument || ''}
                  onChange={e => {
                    updateFileDocumentWizardFormValueSequence({
                      key: 'secondarySupportingDocumentMetadata.category',
                      value: 'Supporting Document',
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: 'secondarySupportingDocumentMetadata.documentType',
                      value: e.target.value,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key:
                        'secondarySupportingDocumentMetadata.previousDocument',
                      value: form.secondaryDocument.documentTitle,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                    validateExternalDocumentInformationSequence();
                  }}
                >
                  <option value="">- Select -</option>
                  {fileDocumentHelper.supportingDocumentTypeList.map(entry => {
                    return (
                      <option
                        key={entry.documentType}
                        value={entry.documentType}
                      >
                        {entry.documentTypeDisplay}
                      </option>
                    );
                  })}
                </select>
                <Text
                  bind="validationErrors.secondarySupportingDocument"
                  className="usa-error-message"
                />
              </div>

              {fileDocumentHelper.showSecondarySupportingDocumentFreeText && (
                <div
                  className={`usa-form-group ${
                    validationErrors.secondarySupportingDocumentFreeText
                      ? 'usa-form-group--error'
                      : ''
                  }`}
                >
                  <label
                    className="usa-label"
                    htmlFor="secondary-supporting-document-free-text"
                    id="secondary-supporting-document-free-text-label"
                  >
                    Supporting Document Signed By
                  </label>
                  <input
                    aria-describedby="secondary-supporting-document-free-text-label"
                    autoCapitalize="none"
                    className="usa-input"
                    id="secondary-supporting-document-free-text"
                    name="secondarySupportingDocumentFreeText"
                    type="text"
                    value={form.secondarySupportingDocumentFreeText || ''}
                    onBlur={() => {
                      validateExternalDocumentInformationSequence();
                    }}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: 'secondarySupportingDocumentMetadata.freeText',
                        value: e.target.value,
                      });
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                  <Text
                    bind="validationErrors.secondarySupportingDocumentFreeText"
                    className="usa-error-message"
                  />
                </div>
              )}

              {fileDocumentHelper.showSecondarySupportingDocumentUpload && (
                <div
                  className={`usa-form-group margin-bottom-0 ${
                    validationErrors.secondarySupportingDocumentFile
                      ? 'usa-form-group--error'
                      : ''
                  }`}
                >
                  <label
                    className={
                      'usa-label ustc-upload with-hint ' +
                      (fileDocumentHelper.showSecondarySupportingDocumentValid
                        ? 'validated'
                        : '')
                    }
                    htmlFor="secondary-supporting-document-file"
                    id="secondary-supporting-document-file-label"
                  >
                    Upload Your Supporting Document{' '}
                    <span className="success-message padding-left-1">
                      <FontAwesomeIcon icon="check-circle" size="sm" />
                    </span>
                  </label>
                  <span className="usa-hint">
                    File must be in PDF format (.pdf). Max file size{' '}
                    {constants.MAX_FILE_SIZE_MB}MB.
                  </span>
                  <StateDrivenFileInput
                    aria-describedby="secondary-supporting-document-file-label"
                    id="secondary-supporting-document-file"
                    name="secondarySupportingDocumentFile"
                    updateFormValueSequence="updateFileDocumentWizardFormValueSequence"
                    validationSequence="validateExternalDocumentInformationSequence"
                  />
                  <Text
                    bind="validationErrors.secondarySupportingDocumentFile"
                    className="usa-error-message"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </>
    );
  },
);
