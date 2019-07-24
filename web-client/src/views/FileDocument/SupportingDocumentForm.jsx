import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SupportingDocumentForm = connect(
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
            addSupportingDocumentToFormSequence({ type: 'primary' });
          }}
        >
          <FontAwesomeIcon
            className="margin-right-05"
            icon="plus-circle"
            size="1x"
          />
          Add Supporting Document
        </button>

        {form.hasSupportingDocuments && (
          <>
            <h2 className="margin-top-4">Supporting Document 1</h2>
            <div className="blue-container">
              <div
                className={`usa-form-group ${
                  validationErrors.supportingDocument
                    ? 'usa-form-group--error '
                    : ''
                } ${!form.supportingDocument ? 'margin-bottom-0 ' : ''} `}
              >
                <label
                  className="usa-label"
                  htmlFor="supporting-document"
                  id="supporting-document-label"
                >
                  Select Supporting Document
                </label>
                <select
                  aria-describedby="supporting-document-label"
                  className={`usa-select ${
                    validationErrors.supportingDocument
                      ? 'usa-select--error'
                      : ''
                  }`}
                  id="supporting-document"
                  name="supportingDocument"
                  value={form.supportingDocument || ''}
                  onChange={e => {
                    updateFileDocumentWizardFormValueSequence({
                      key: 'supportingDocumentMetadata.category',
                      value: 'Supporting Document',
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: 'supportingDocumentMetadata.documentType',
                      value: e.target.value,
                    });
                    updateFileDocumentWizardFormValueSequence({
                      key: 'supportingDocumentMetadata.previousDocument',
                      value: form.documentTitle,
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
                  bind="validationErrors.supportingDocument"
                  className="usa-error-message"
                />
              </div>

              {fileDocumentHelper.showSupportingDocumentFreeText && (
                <div
                  className={`usa-form-group ${
                    validationErrors.supportingDocumentFreeText
                      ? 'usa-form-group--error'
                      : ''
                  }`}
                >
                  <label
                    className="usa-label"
                    htmlFor="supporting-document-free-text"
                    id="supporting-document-free-text-label"
                  >
                    Supporting Document Signed By
                  </label>
                  <input
                    aria-describedby="supporting-document-free-text-label"
                    autoCapitalize="none"
                    className="usa-input"
                    id="supporting-document-free-text"
                    name="supportingDocumentFreeText"
                    type="text"
                    value={form.supportingDocumentFreeText || ''}
                    onBlur={() => {
                      validateExternalDocumentInformationSequence();
                    }}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: 'supportingDocumentMetadata.freeText',
                        value: e.target.value,
                      });
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                  <Text
                    bind="validationErrors.supportingDocumentFreeText"
                    className="usa-error-message"
                  />
                </div>
              )}

              {fileDocumentHelper.showSupportingDocumentUpload && (
                <div
                  className={`usa-form-group margin-bottom-0 ${
                    validationErrors.supportingDocumentFile
                      ? 'usa-form-group--error'
                      : ''
                  }`}
                >
                  <label
                    className={
                      'usa-label ustc-upload with-hint ' +
                      (fileDocumentHelper.showSupportingDocumentValid
                        ? 'validated'
                        : '')
                    }
                    htmlFor="supporting-document-file"
                    id="supporting-document-file-label"
                  >
                    Upload Your Supporting Document{' '}
                    <span className="success-message">
                      <FontAwesomeIcon icon="check-circle" size="sm" />
                    </span>
                  </label>
                  <span className="usa-hint">
                    File must be in PDF format (.pdf). Max file size{' '}
                    {constants.MAX_FILE_SIZE_MB}MB.
                  </span>
                  <StateDrivenFileInput
                    aria-describedby="supporting-document-file-label"
                    id="supporting-document-file"
                    name="supportingDocumentFile"
                    updateFormValueSequence="updateFileDocumentWizardFormValueSequence"
                    validationSequence="validateExternalDocumentInformationSequence"
                  />
                  <Text
                    bind="validationErrors.supportingDocumentFile"
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
