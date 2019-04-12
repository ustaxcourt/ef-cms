import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PrimaryDocumentForm = connect(
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
        <h3>Tell Us About the {form.documentTitle}</h3>
        <div className="blue-container">
          <div className="usa-grid-full">
            <div className="usa-width-seven-twelfths push-right">
              <div id="document-upload-hint" className="alert-gold">
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
                  validationErrors.primaryDocumentFile ? 'usa-input-error' : ''
                }`}
              >
                <label
                  htmlFor="primary-document"
                  className={
                    'ustc-upload ' +
                    (fileDocumentHelper.showPrimaryDocumentValid
                      ? 'validated'
                      : '')
                  }
                >
                  Upload Your Document{' '}
                  <span className="success-message">
                    <FontAwesomeIcon icon="check-circle" size="sm" />
                  </span>
                </label>
                <input
                  id="primary-document"
                  type="file"
                  accept=".pdf"
                  name="primaryDocumentFile"
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.files[0],
                    });
                    validateExternalDocumentInformationSequence();
                  }}
                />
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.primaryDocumentFile"
                />
              </div>

              <div
                className={`ustc-form-group ${
                  validationErrors.certificateOfService ? 'usa-input-error' : ''
                }`}
              >
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>
                    Does Your Filing Include A Certificate of Service?
                  </legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No'].map(option => (
                      <li key={option}>
                        <input
                          id={`certificate-${option}`}
                          type="radio"
                          name="certificateOfService"
                          value={option}
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                        <label htmlFor={`certificate-${option}`}>
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.certificateOfService"
                />
              </div>

              {form.certificateOfService && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.certificateOfServiceDate
                      ? 'usa-input-error'
                      : ''
                  }`}
                >
                  <fieldset className="service-date">
                    <legend>Service Date</legend>
                    <div className="usa-date-of-birth">
                      <div className="usa-form-group usa-form-group-month">
                        <label htmlFor="service-date-month">MM</label>
                        <input
                          className="usa-input-inline"
                          id="service-date-month"
                          name="certificateOfServiceMonth"
                          type="number"
                          min="1"
                          max="12"
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
                      </div>
                      <div className="usa-form-group usa-form-group-day">
                        <label htmlFor="service-date-day">DD</label>
                        <input
                          className="usa-input-inline"
                          id="service-date-day"
                          name="certificateOfServiceDay"
                          type="number"
                          min="1"
                          max="31"
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
                      </div>
                      <div className="usa-form-group usa-form-group-year">
                        <label htmlFor="service-date-year">YYYY</label>
                        <input
                          className="usa-input-inline"
                          id="service-date-year"
                          name="certificateOfServiceYear"
                          type="number"
                          min="1900"
                          max="2000"
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
                      </div>
                    </div>
                  </fieldset>
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.certificateOfServiceDate"
                  />
                </div>
              )}

              <div
                className={`ustc-form-group ${
                  validationErrors.exhibits ? 'usa-input-error' : ''
                }`}
              >
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>Does Your Filing Include Exhibits?</legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No'].map(option => (
                      <li key={option}>
                        <input
                          id={`exhibits-${option}`}
                          type="radio"
                          name="exhibits"
                          value={option}
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                        <label htmlFor={`exhibits-${option}`}>{option}</label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.exhibits"
                />
              </div>

              <div
                className={`ustc-form-group ${
                  validationErrors.attachments ? 'usa-input-error' : ''
                }`}
              >
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>Does Your Filing Include Attachments?</legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No'].map(option => (
                      <li key={option}>
                        <input
                          id={`attachments-${option}`}
                          type="radio"
                          name="attachments"
                          value={option}
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                        <label htmlFor={`attachments-${option}`}>
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.attachments"
                />
              </div>

              {fileDocumentHelper.showObjection && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.objections ? 'usa-input-error' : ''
                  }`}
                >
                  <fieldset className="usa-fieldset-inputs usa-sans">
                    <legend>Are There Any Objections to This Document?</legend>
                    <ul className="usa-unstyled-list">
                      {['Yes', 'No', 'Unknown'].map(option => (
                        <li key={option}>
                          <input
                            id={`objections-${option}`}
                            type="radio"
                            name="objections"
                            value={option}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                              validateExternalDocumentInformationSequence();
                            }}
                          />
                          <label htmlFor={`objections-${option}`}>
                            {option}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.objections"
                  />
                </div>
              )}

              <div
                className={`ustc-form-group ${
                  validationErrors.hasSupportingDocuments
                    ? 'usa-input-error'
                    : ''
                }`}
              >
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>
                    Do You Have Any Supporting Documents for This Filing?
                  </legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No'].map(option => (
                      <li key={option}>
                        <input
                          id={`supporting-documents-${option}`}
                          type="radio"
                          name="hasSupportingDocuments"
                          value={option}
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                        <label htmlFor={`supporting-documents-${option}`}>
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.hasSupportingDocuments"
                />
              </div>

              {form.hasSupportingDocuments && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.supportingDocument ? 'usa-input-error' : ''
                  }`}
                >
                  <label htmlFor="supporting-document">
                    Select Supporting Document
                  </label>
                  <select
                    name="supportingDocument"
                    id="supporting-document"
                    aria-label="category"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                    value={form.supportingDocument}
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
                    bind="validationErrors.supportingDocument"
                  />
                </div>
              )}

              {fileDocumentHelper.showSupportingDocumentFreeText && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.supportingDocumentFreeText
                      ? 'usa-input-error'
                      : ''
                  }`}
                >
                  <label htmlFor="supporting-document-free-text">
                    Supporting Document Signed By
                  </label>
                  <input
                    id="supporting-document-free-text"
                    type="text"
                    name="supportingDocumentFreeText"
                    autoCapitalize="none"
                    value={form.supportingDocumentFreeText}
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
                    bind="validationErrors.supportingDocumentFreeText"
                  />
                </div>
              )}

              {fileDocumentHelper.showSupportingDocumentUpload && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.supportingDocumentFile
                      ? 'usa-input-error'
                      : ''
                  }`}
                >
                  <label
                    htmlFor="supporting-document-file"
                    className={
                      'ustc-upload ' +
                      (fileDocumentHelper.showSupportingDocumentValid
                        ? 'validated'
                        : '')
                    }
                  >
                    Upload Your Supporting Document{' '}
                    <span className="success-message">
                      <FontAwesomeIcon icon="check-circle" size="sm" />
                    </span>
                  </label>
                  <input
                    id="supporting-document-file"
                    type="file"
                    accept=".pdf"
                    aria-describedby="petition-hint"
                    name="supportingDocumentFile"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.files[0],
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.supportingDocumentFile"
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
