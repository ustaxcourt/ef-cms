import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { SupportingDocumentInclusionsForm } from './SupportingDocumentInclusionsForm';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const SecondarySupportingDocumentForm = connect(
  {
    constants: state.constants,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    index: props.index,
    removeSecondarySupportingDocumentSequence:
      sequences.removeSecondarySupportingDocumentSequence,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationErrors: state.validationErrors,
  },
  function SecondarySupportingDocumentForm({
    constants,
    fileDocumentHelper,
    form,
    index,
    removeSecondarySupportingDocumentSequence,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
    validationErrors,
  }) {
    return (
      <>
        <h2 className="margin-top-4">
          <div className="display-flex">
            Secondary Supporting Document {index + 1}{' '}
            <Button
              link
              className="red-warning text-left padding-0 margin-left-1"
              icon="trash"
              onClick={() => {
                removeSecondarySupportingDocumentSequence({ index });
              }}
            >
              Delete
            </Button>
          </div>
        </h2>
        <div className="blue-container">
          <FormGroup
            className={
              !form.secondarySupportingDocuments[index].supportingDocument &&
              'margin-bottom-0'
            }
            errorText={
              validationErrors.secondarySupportingDocuments &&
              validationErrors.secondarySupportingDocuments[index] &&
              validationErrors.secondarySupportingDocuments[index]
                .supportingDocument
            }
          >
            <label
              className="usa-label"
              htmlFor={`secondary-supporting-document-${index}`}
              id={`secondary-supporting-document-${index}-label`}
            >
              Select supporting document
            </label>
            <select
              aria-describedby={`secondary-supporting-document-${index}-label`}
              className={classNames(
                'usa-select',
                validationErrors.secondarySupportingDocuments &&
                  validationErrors.secondarySupportingDocuments[index] &&
                  validationErrors.secondarySupportingDocuments[index]
                    .supportingDocument &&
                  'usa-select--error',
              )}
              id={`secondary-supporting-document-${index}`}
              name={`secondarySupportingDocuments.${index}.supportingDocument`}
              value={
                form.secondarySupportingDocuments[index].supportingDocument ||
                ''
              }
              onChange={e => {
                updateFileDocumentWizardFormValueSequence({
                  key: `secondarySupportingDocuments.${index}.category`,
                  value: 'Supporting Document',
                });
                updateFileDocumentWizardFormValueSequence({
                  key: `secondarySupportingDocuments.${index}.documentType`,
                  value: e.target.value,
                });
                updateFileDocumentWizardFormValueSequence({
                  key: `secondarySupportingDocuments.${index}.previousDocument`,
                  value: {
                    documentTitle:
                      form.secondaryDocument.documentTitle ||
                      form.secondaryDocument.documentType,
                    documentType: form.secondaryDocument.documentType,
                  },
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
          </FormGroup>

          {fileDocumentHelper.secondarySupportingDocuments[index]
            .showSupportingDocumentFreeText && (
            <FormGroup
              errorText={
                validationErrors.secondarySupportingDocuments &&
                validationErrors.secondarySupportingDocuments[index] &&
                validationErrors.secondarySupportingDocuments[index]
                  .supportingDocumentFreeText
              }
            >
              <label
                className="usa-label"
                htmlFor={`secondary-supporting-document-free-text-${index}`}
                id={`secondary-supporting-document-free-text-${index}-label`}
              >
                Supporting document signed by
              </label>
              <input
                aria-describedby={`secondary-supporting-document-free-text-${index}-label`}
                autoCapitalize="none"
                className="usa-input"
                id={`secondary-supporting-document-free-text-${index}`}
                name={`secondarySupportingDocuments.${index}.supportingDocumentFreeText`}
                type="text"
                value={
                  form.secondarySupportingDocuments[index]
                    .supportingDocumentFreeText || ''
                }
                onBlur={() => {
                  validateExternalDocumentInformationSequence();
                }}
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: `secondarySupportingDocuments.${index}.freeText`,
                    value: e.target.value,
                  });
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          )}

          {fileDocumentHelper.secondarySupportingDocuments[index]
            .showSupportingDocumentUpload && (
            <>
              <FormGroup
                errorText={
                  validationErrors.secondarySupportingDocuments &&
                  validationErrors.secondarySupportingDocuments[index] &&
                  validationErrors.secondarySupportingDocuments[index]
                    .supportingDocumentFile
                }
              >
                <label
                  className={classNames(
                    'usa-label ustc-upload with-hint',
                    fileDocumentHelper.secondarySupportingDocuments[index]
                      .showSupportingDocumentValid && 'validated',
                  )}
                  htmlFor={`secondary-supporting-document-file-${index}`}
                  id={`secondary-supporting-document-file-${index}-label`}
                >
                  Upload your supporting document{' '}
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
                  file={
                    form.secondarySupportingDocuments[index]
                      .supportingDocumentFile
                  }
                  id={`secondary-supporting-document-file-${index}`}
                  name={`secondarySupportingDocuments.${index}.supportingDocumentFile`}
                  updateFormValueSequence="updateFileDocumentWizardFormValueSequence"
                  validationSequence="validateExternalDocumentInformationSequence"
                />
              </FormGroup>

              <SupportingDocumentInclusionsForm
                bind={`form.secondarySupportingDocuments.${index}`}
                type={`secondarySupportingDocuments.${index}`}
                validationBind={`validationErrors.supportingDocument${index}`}
              />
            </>
          )}
        </div>
      </>
    );
  },
);
