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
    fileDocumentHelper,
    form,
    updateFileDocumentWizardFormValueSequence,
    validateExternalDocumentInformationSequence,
    validationErrors,
    constants,
  }) => {
    return (
      <React.Fragment>
        <h2>Tell Us About the {form.secondaryDocument.documentTitle}</h2>
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
                  }`}
                >
                  <label
                    htmlFor="secondary-document"
                    id="secondary-document-label"
                    className={
                      'usa-label ustc-upload with-hint ' +
                      (fileDocumentHelper.showSecondaryDocumentValid
                        ? 'validated'
                        : '')
                    }
                  >
                    Upload Your Document{' '}
                    <span className="success-message">
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
                    id="secondary-document"
                    name="secondaryDocumentFile"
                    aria-describedby="secondary-document-label"
                    updateFormValueSequence="updateFileDocumentWizardFormValueSequence"
                    validationSequence="validateExternalDocumentInformationSequence"
                  />

                  <Text
                    className="usa-error-message"
                    bind="validationErrors.secondaryDocumentFile"
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
                }`}
              >
                <fieldset className="usa-fieldset">
                  <legend id="secondary-support-docs">
                    Do You Have Any Supporting Documents for This Filing?
                  </legend>
                  {['Yes', 'No'].map(option => (
                    <div className="usa-radio usa-radio__inline" key={option}>
                      <input
                        id={`secondary-supporting-documents-${option}`}
                        type="radio"
                        aria-describedby="secondary-support-docs"
                        name="hasSecondarySupportingDocuments"
                        className="usa-radio__input"
                        value={option}
                        checked={
                          form.hasSecondarySupportingDocuments ===
                          (option === 'Yes')
                        }
                        onChange={e => {
                          updateFileDocumentWizardFormValueSequence({
                            key: e.target.name,
                            value: e.target.value === 'Yes',
                          });
                          validateExternalDocumentInformationSequence();
                        }}
                      />
                      <label
                        htmlFor={`secondary-supporting-documents-${option}`}
                        className="usa-radio__label"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </fieldset>
                <Text
                  className="usa-error-message"
                  bind="validationErrors.hasSecondarySupportingDocuments"
                />
              </div>
            )}

            {form.hasSecondarySupportingDocuments && (
              <div
                className={`usa-form-group ${
                  validationErrors.secondarySupportingDocument
                    ? 'usa-form-group--error'
                    : ''
                }`}
              >
                <label
                  htmlFor="secondary-supporting-document"
                  id="secondary-supporting-document-label"
                  className="usa-label"
                >
                  Select Supporting Document
                </label>
                <select
                  name="secondarySupportingDocument"
                  id="secondary-supporting-document"
                  aria-describedby="secondary-supporting-document-label"
                  className={`usa-select ${
                    validationErrors.secondarySupportingDocument
                      ? 'usa-select--error'
                      : ''
                  }`}
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
                  value={form.secondarySupportingDocument || ''}
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
                  className="usa-error-message"
                  bind="validationErrors.secondarySupportingDocument"
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
                  htmlFor="secondary-supporting-document-free-text"
                  id="secondary-supporting-document-free-text-label"
                  className="usa-label"
                >
                  Supporting Document Signed By
                </label>
                <input
                  id="secondary-supporting-document-free-text"
                  type="text"
                  name="secondarySupportingDocumentFreeText"
                  aria-describedby="secondary-supporting-document-free-text-label"
                  autoCapitalize="none"
                  className="usa-input"
                  value={form.secondarySupportingDocumentFreeText || ''}
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
                  onBlur={() => {
                    validateExternalDocumentInformationSequence();
                  }}
                />
                <Text
                  className="usa-error-message"
                  bind="validationErrors.secondarySupportingDocumentFreeText"
                />
              </div>
            )}

            {fileDocumentHelper.showSecondarySupportingDocumentUpload && (
              <div
                className={`usa-form-group ${
                  validationErrors.secondarySupportingDocumentFile
                    ? 'usa-form-group--error'
                    : ''
                }`}
              >
                <label
                  htmlFor="secondary-supporting-document-file"
                  id="secondary-supporting-document-file-label"
                  className={
                    'usa-label ustc-upload with-hint ' +
                    (fileDocumentHelper.showSecondarySupportingDocumentValid
                      ? 'validated'
                      : '')
                  }
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
                  id="secondary-supporting-document-file"
                  name="secondarySupportingDocumentFile"
                  aria-describedby="secondary-supporting-document-file-label"
                  updateFormValueSequence="updateFileDocumentWizardFormValueSequence"
                  validationSequence="validateExternalDocumentInformationSequence"
                />

                <Text
                  className="usa-error-message"
                  bind="validationErrors.secondarySupportingDocumentFile"
                />
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  },
);
