import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const SecondarySupportingDocumentForm = connect(
  {
    constants: state.constants,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    index: props.index,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    fileDocumentHelper,
    form,
    index,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
    validationErrors,
  }) => {
    return (
      <>
        <h2 className="margin-top-4">
          Secondary Supporting Document {index + 1}
        </h2>
        <div className="blue-container">
          <div
            className={`usa-form-group ${
              validationErrors.secondarySupportingDocuments &&
              validationErrors.secondarySupportingDocuments[index]
                .secondarySupportingDocument
                ? 'usa-form-group--error'
                : ''
            } ${
              !form.secondarySupportingDocuments[index]
                .secondarySupportingDocument
                ? 'margin-bottom-0'
                : ''
            }`}
          >
            <label
              className="usa-label"
              htmlFor={`secondary-supporting-document-${index}`}
              id={`secondary-supporting-document-${index}-label`}
            >
              Select Supporting Document
            </label>
            <select
              aria-describedby={`secondary-supporting-document-${index}-label`}
              className={`usa-select ${
                validationErrors.secondarySupportingDocuments &&
                validationErrors.secondarySupportingDocuments[index]
                  .secondarySupportingDocument
                  ? 'usa-select--error'
                  : ''
              }`}
              id={`secondary-supporting-document-${index}`}
              name={`secondarySupportingDocuments.${index}.secondarySupportingDocument`}
              value={
                form.secondarySupportingDocuments[index]
                  .secondarySupportingDocument || ''
              }
              onChange={e => {
                updateFileDocumentWizardFormValueSequence({
                  key: `supportingDocuments.${index}.secondarySupportingDocumentMetadata.category`,
                  value: 'Supporting Document',
                });
                updateFileDocumentWizardFormValueSequence({
                  key: `supportingDocuments.${index}.secondarySupportingDocumentMetadata.documentType`,
                  value: e.target.value,
                });
                updateFileDocumentWizardFormValueSequence({
                  key: `supportingDocuments.${index}.secondarySupportingDocumentMetadata.previousDocument`,
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
                  <option key={entry.documentType} value={entry.documentType}>
                    {entry.documentTypeDisplay}
                  </option>
                );
              })}
            </select>
            <Text
              bind={`validationErrors.secondarySupportingDocuments.${index}.secondarySupportingDocument`}
              className="usa-error-message"
            />
          </div>

          {fileDocumentHelper.secondarySupportingDocuments[index]
            .showSecondarySupportingDocumentFreeText && (
            <div
              className={`usa-form-group ${
                validationErrors.secondarySupportingDocuments &&
                validationErrors.secondarySupportingDocuments[index]
                  .secondarySupportingDocumentFreeText
                  ? 'usa-form-group--error'
                  : ''
              }`}
            >
              <label
                className="usa-label"
                htmlFor={`secondary-supporting-document-free-text-${index}`}
                id={`secondary-supporting-document-free-text-${index}-label`}
              >
                Supporting Document Signed By
              </label>
              <input
                aria-describedby={`secondary-supporting-document-free-text-${index}-label`}
                autoCapitalize="none"
                className="usa-input"
                id={`secondary-supporting-document-free-text-${index}`}
                name={`secondarySupportingDocuments.${index}.secondarySupportingDocumentFreeText`}
                type="text"
                value={
                  form.secondarySupportingDocuments[index]
                    .secondarySupportingDocumentFreeText || ''
                }
                onBlur={() => {
                  validateExternalDocumentInformationSequence();
                }}
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: `secondarySupportingDocuments.${index}.secondarySupportingDocumentMetadata.freeText`,
                    value: e.target.value,
                  });
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
              <Text
                bind={`validationErrors.secondarySupportingDocuments.${index}.secondarySupportingDocumentFreeText`}
                className="usa-error-message"
              />
            </div>
          )}

          {fileDocumentHelper.secondarySupportingDocuments[index]
            .showSecondarySupportingDocumentUpload && (
            <div
              className={`usa-form-group margin-bottom-0 ${
                validationErrors.secondarySupportingDocuments &&
                validationErrors.secondarySupportingDocuments[index]
                  .secondarySupportingDocumentFile
                  ? 'usa-form-group--error'
                  : ''
              }`}
            >
              <label
                className={
                  'usa-label ustc-upload with-hint ' +
                  (fileDocumentHelper.secondarySupportingDocuments[index]
                    .showSecondarySupportingDocumentValid
                    ? 'validated'
                    : '')
                }
                htmlFor={`secondary-supporting-document-file-${index}`}
                id={`secondary-supporting-document-file-${index}-label`}
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
                aria-describedby={`secondary-supporting-document-file-${index}-label`}
                id={`secondary-supporting-document-file-${index}`}
                name={`secondarySupportingDocuments.${index}.secondarySupportingDocumentFile`}
                updateFormValueSequence="updateFileDocumentWizardFormValueSequence"
                validationSequence="validateExternalDocumentInformationSequence"
              />
              <Text
                bind={`validationErrors.secondarySupportingDocuments.${index}.secondarySupportingDocumentFile`}
                className="usa-error-message"
              />
            </div>
          )}
        </div>
      </>
    );
  },
);
