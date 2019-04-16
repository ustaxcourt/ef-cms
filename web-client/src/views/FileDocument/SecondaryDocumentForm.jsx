import { StateDrivenFileInput } from './StateDrivenFileInput';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondaryDocumentForm = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationErrors: state.validationErrors,
  },
  ({
    fileDocumentHelper,
    form,
    updateFormValueSequence,
    validateExternalDocumentInformationSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <h3>Tell Us About the {form.secondaryDocument.documentTitle}</h3>
        <div className="blue-container">
          <div className="usa-grid-full">
            <div className="usa-width-seven-twelfths push-right">
              <div id="document-secondary-upload-hint" className="alert-gold">
                <span className="usa-form-hint ustc-form-hint-with-svg">
                  <FontAwesomeIcon
                    icon={['far', 'arrow-alt-circle-left']}
                    className="fa-icon-gold"
                    size="lg"
                  />
                  Remember to remove or redact all personal information (such as
                  Social Security Numbers, Taxpayer Identification Numbers, or
                  Employer Identification Numbers) from your documents.
                </span>
              </div>
            </div>

            <div className="usa-width-five-twelfths">
              <div
                className={`ustc-form-group ${
                  validationErrors.secondaryDocumentFile
                    ? 'usa-input-error'
                    : ''
                }`}
              >
                <label
                  htmlFor="secondary-document"
                  id="secondary-document-label"
                  className={
                    'ustc-upload ' +
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
                    <span className="usa-form-hint">(optional)</span>
                  )}
                </label>

                <StateDrivenFileInput
                  id="secondary-document"
                  name="secondaryDocumentFile"
                />

                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.secondaryDocumentFile"
                />
              </div>

              <div
                className={`ustc-form-group ${
                  validationErrors.hasSecondarySupportingDocuments
                    ? 'usa-input-error'
                    : ''
                }`}
              >
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend id="secondary-support-docs">
                    Do You Have Any Supporting Documents for This Filing?
                  </legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No'].map(option => (
                      <li key={option}>
                        <input
                          id={`secondary-supporting-documents-${option}`}
                          type="radio"
                          aria-describedby="secondary-support-docs"
                          name="hasSecondarySupportingDocuments"
                          value={option}
                          checked={
                            form.hasSecondarySupportingDocuments ===
                            (option === 'Yes')
                          }
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                        <label
                          htmlFor={`secondary-supporting-documents-${option}`}
                        >
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.hasSecondarySupportingDocuments"
                />
              </div>

              {form.hasSecondarySupportingDocuments && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.secondarySupportingDocument
                      ? 'usa-input-error'
                      : ''
                  }`}
                >
                  <label
                    htmlFor="secondary-supporting-document"
                    id="secondary-supporting-document-label"
                  >
                    Select Supporting Document
                  </label>
                  <select
                    name="secondarySupportingDocument"
                    id="secondary-supporting-document"
                    aria-describedby="secondary-supporting-document-label"
                    onChange={e => {
                      updateFormValueSequence({
                        key: 'secondarySupportingDocumentMetadata.category',
                        value: 'Supporting Document',
                      });
                      updateFormValueSequence({
                        key: 'secondarySupportingDocumentMetadata.documentType',
                        value: e.target.value,
                      });
                      updateFormValueSequence({
                        key:
                          'secondarySupportingDocumentMetadata.previousDocument',
                        value: form.secondaryDocument.documentTitle,
                      });
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                    value={form.secondarySupportingDocument}
                  >
                    <option value="">- Select -</option>
                    {fileDocumentHelper.supportingDocumentTypeList.map(
                      entry => {
                        return (
                          <option
                            key={entry.documentType}
                            value={entry.documentType}
                          >
                            {entry.documentTypeDisplay}
                          </option>
                        );
                      },
                    )}
                  </select>
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.secondarySupportingDocument"
                  />
                </div>
              )}

              {fileDocumentHelper.showSecondarySupportingDocumentFreeText && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.secondarySupportingDocumentFreeText
                      ? 'usa-input-error'
                      : ''
                  }`}
                >
                  <label
                    htmlFor="secondary-supporting-document-free-text"
                    id="secondary-supporting-document-free-text-label"
                  >
                    Supporting Document Signed By
                  </label>
                  <input
                    id="secondary-supporting-document-free-text"
                    type="text"
                    name="secondarySupportingDocumentFreeText"
                    aria-describedby="secondary-supporting-document-free-text-label"
                    autoCapitalize="none"
                    value={form.secondarySupportingDocumentFreeText}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.secondarySupportingDocumentFreeText"
                  />
                </div>
              )}

              {fileDocumentHelper.showSecondarySupportingDocumentUpload && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.secondarySupportingDocumentFile
                      ? 'usa-input-error'
                      : ''
                  }`}
                >
                  <label
                    htmlFor="secondary-supporting-document-file"
                    id="secondary-supporting-document-file-label"
                    className={
                      'ustc-upload ' +
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

                  <StateDrivenFileInput
                    id="secondary-supporting-document-file"
                    name="secondarySupportingDocumentFile"
                  />

                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.secondarySupportingDocumentFile"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
