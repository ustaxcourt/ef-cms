import { StateDrivenFileInput } from './StateDrivenFileInput';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondaryDocumentForm = connect(
  {
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
    constants,
    fileDocumentHelper,
    form,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <h2 className="margin-top-4">
          Tell Us About the {form.secondaryDocument.documentTitle}
        </h2>
        <div className="blue-container">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-7 push-right">
                <Hint>
                  Remember to remove or redact all personal information (such as
                  Social Security Numbers, Taxpayer Identification Numbers, or
                  Employer Identification Numbers) from your documents.
                </Hint>
              </div>

              <div className="tablet:grid-col-5">
                <div
                  className={`usa-form-group ${
                    validationErrors.secondaryDocumentFile
                      ? 'usa-form-group--error'
                      : ''
                  } ${
                    !fileDocumentHelper.showSecondaryDocumentValid
                      ? 'margin-bottom-0'
                      : ''
                  }`}
                >
                  <label
                    className={
                      'usa-label ustc-upload with-hint ' +
                      (fileDocumentHelper.showSecondaryDocumentValid
                        ? 'validated'
                        : '')
                    }
                    htmlFor="secondary-document"
                    id="secondary-document-label"
                  >
                    Upload Your Document{' '}
                    <span className="success-message padding-left-1">
                      <FontAwesomeIcon icon="check-circle" size="sm" />
                    </span>{' '}
                    {fileDocumentHelper.isSecondaryDocumentUploadOptional && (
                      <span className="usa-hint">(optional)</span>
                    )}
                  </label>
                  <span className="usa-hint">
                    File must be in PDF format (.pdf). Max file size{' '}
                    {constants.MAX_FILE_SIZE_MB}MB.
                  </span>
                  <StateDrivenFileInput
                    aria-describedby="secondary-document-label"
                    id="secondary-document"
                    name="secondaryDocumentFile"
                    updateFormValueSequence="updateFileDocumentWizardFormValueSequence"
                    validationSequence="validateExternalDocumentInformationSequence"
                  />

                  <Text
                    bind="validationErrors.secondaryDocumentFile"
                    className="usa-error-message"
                  />
                </div>
              </div>
            </div>

            {fileDocumentHelper.showSecondaryDocumentValid && (
              <div
                className={`usa-form-group ${
                  validationErrors.hasSecondarySupportingDocuments
                    ? 'usa-form-group--error'
                    : ''
                } ${
                  !form.hasSecondarySupportingDocuments ? 'margin-bottom-0' : ''
                }`}
              >
                <fieldset
                  className={`usa-fieldset ${
                    !form.hasSecondarySupportingDocuments
                      ? 'margin-bottom-0'
                      : ''
                  }`}
                >
                  <legend id="secondary-support-docs">
                    Do You Have Any Supporting Documents for This Filing?
                  </legend>
                  {['Yes', 'No'].map(option => (
                    <div className="usa-radio usa-radio__inline" key={option}>
                      <input
                        aria-describedby="secondary-support-docs"
                        checked={
                          form.hasSecondarySupportingDocuments ===
                          (option === 'Yes')
                        }
                        className="usa-radio__input"
                        id={`secondary-supporting-documents-${option}`}
                        name="hasSecondarySupportingDocuments"
                        type="radio"
                        value={option}
                        onChange={e => {
                          updateFileDocumentWizardFormValueSequence({
                            key: e.target.name,
                            value: e.target.value === 'Yes',
                          });
                          validateExternalDocumentInformationSequence();
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={`secondary-supporting-documents-${option}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </fieldset>
                <Text
                  bind="validationErrors.hasSecondarySupportingDocuments"
                  className="usa-error-message"
                />
              </div>
            )}

            {form.hasSecondarySupportingDocuments && (
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
            )}

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
        </div>
      </React.Fragment>
    );
  },
);
