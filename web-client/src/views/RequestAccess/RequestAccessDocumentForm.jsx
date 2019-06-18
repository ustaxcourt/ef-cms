import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const RequestAccessDocumentForm = connect(
  {
    constants: state.constants,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    requestAccessHelper: state.requestAccessHelper,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
    validationErrors: state.validationErrors,
  },
  ({
    fileDocumentHelper,
    requestAccessHelper,
    form,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
    validationErrors,
    constants,
  }) => {
    return (
      <React.Fragment>
        <h2 className="margin-top-4">Tell Us About This Document</h2>
        <div className="blue-container">
          <div className="grid-container padding-x-0">
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
                  validationErrors.primaryDocumentFile
                    ? 'usa-form-group--error'
                    : ''
                }`}
              >
                <label
                  htmlFor="primary-document"
                  id="primary-document-label"
                  className={
                    'usa-label ustc-upload with-hint' +
                    (requestAccessHelper.showPrimaryDocumentValid
                      ? 'validated'
                      : '')
                  }
                >
                  Upload Your Document{' '}
                  <span className="success-message padding-left-1">
                    <FontAwesomeIcon icon="check-circle" size="sm" />
                  </span>
                </label>
                <span className="usa-hint">
                  File must be in PDF format (.pdf). Max file size{' '}
                  {constants.MAX_FILE_SIZE_MB}MB.
                </span>
                <StateDrivenFileInput
                  id="primary-document"
                  name="primaryDocumentFile"
                  aria-describedby="primary-document-label"
                  updateFormValueSequence="updateCaseAssociationFormValueSequence"
                  validationSequence="validateCaseAssociationRequestSequence"
                />
                <Text
                  className="usa-error-message"
                  bind="validationErrors.primaryDocumentFile"
                />
              </div>
              <div
                className={`usa-form-group ${
                  validationErrors.certificateOfService
                    ? 'usa-form-group--error'
                    : ''
                }`}
              >
                <fieldset className="usa-fieldset">
                  <legend>
                    Does Your Filing Include A Certificate of Service?
                  </legend>
                  {['Yes', 'No'].map(option => (
                    <div className="usa-radio usa-radio__inline" key={option}>
                      <input
                        id={`certificate-${option}`}
                        type="radio"
                        name="certificateOfService"
                        className="usa-radio__input"
                        value={option}
                        checked={
                          form.certificateOfService === (option === 'Yes')
                        }
                        onChange={e => {
                          updateCaseAssociationFormValueSequence({
                            key: e.target.name,
                            value: e.target.value === 'Yes',
                          });
                          validateCaseAssociationRequestSequence();
                        }}
                      />
                      <label
                        htmlFor={`certificate-${option}`}
                        className="usa-radio__label"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </fieldset>
                <Text
                  className="usa-error-message"
                  bind="validationErrors.certificateOfService"
                />
              </div>
              {form.certificateOfService && (
                <div
                  className={`usa-form-group ${
                    validationErrors.certificateOfServiceDate
                      ? 'usa-form-group--error'
                      : ''
                  }`}
                >
                  <fieldset className="service-date usa-fieldset">
                    <legend id="service-date-legend" className="usa-legend">
                      Service Date
                    </legend>
                    <div className="usa-memorable-date">
                      <div className="usa-form-group usa-form-group--month">
                        <label
                          htmlFor="service-date-month"
                          className="usa-label"
                          aria-hidden="true"
                        >
                          MM
                        </label>
                        <input
                          className="usa-input usa-input-inline"
                          id="service-date-month"
                          aria-label="month, two digits"
                          aria-describedby="service-date-legend"
                          name="certificateOfServiceMonth"
                          value={form.certificateOfServiceMonth}
                          type="number"
                          min="1"
                          max="12"
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                          onBlur={() => {
                            validateCaseAssociationRequestSequence();
                          }}
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--day">
                        <label
                          htmlFor="service-date-day"
                          className="usa-label"
                          aria-hidden="true"
                        >
                          DD
                        </label>
                        <input
                          className="usa-input usa-input-inline"
                          id="service-date-day"
                          name="certificateOfServiceDay"
                          value={form.certificateOfServiceDay}
                          aria-label="day, two digits"
                          aria-describedby="service-date-legend"
                          type="number"
                          min="1"
                          max="31"
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                          onBlur={() => {
                            validateCaseAssociationRequestSequence();
                          }}
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--year">
                        <label
                          htmlFor="service-date-year"
                          className="usa-label"
                          aria-hidden="true"
                        >
                          YYYY
                        </label>
                        <input
                          className="usa-input usa-input-inline"
                          id="service-date-year"
                          aria-label="year, four digits"
                          aria-describedby="service-date-legend"
                          name="certificateOfServiceYear"
                          value={form.certificateOfServiceYear}
                          type="number"
                          min="1900"
                          max="2100"
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                          onBlur={() => {
                            validateCaseAssociationRequestSequence();
                          }}
                        />
                      </div>
                    </div>
                  </fieldset>
                  <Text
                    className="usa-error-message"
                    bind="validationErrors.certificateOfServiceDate"
                  />
                </div>
              )}
              {requestAccessHelper.documentWithExhibits && (
                <div
                  className={`usa-form-group ${
                    validationErrors.exhibits ? 'usa-form-group--error' : ''
                  }`}
                >
                  <fieldset className="usa-fieldset">
                    <legend id="exhibits-legend">
                      Does Your Filing Include Exhibits?
                    </legend>
                    {['Yes', 'No'].map(option => (
                      <div className="usa-radio usa-radio__inline" key={option}>
                        <input
                          id={`exhibits-${option}`}
                          type="radio"
                          name="exhibits"
                          aria-describedby="exhibits-legend"
                          className="usa-radio__input"
                          value={option}
                          checked={form.exhibits === (option === 'Yes')}
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateCaseAssociationRequestSequence();
                          }}
                        />
                        <label
                          htmlFor={`exhibits-${option}`}
                          className="usa-radio__label"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                  <Text
                    className="usa-error-message"
                    bind="validationErrors.exhibits"
                  />
                </div>
              )}

              {requestAccessHelper.documentWithAttachments && (
                <div
                  className={`usa-form-group ${
                    validationErrors.attachments ? 'usa-form-group--error' : ''
                  }`}
                >
                  <fieldset className="usa-fieldset">
                    <legend id="attachments-legend">
                      Does Your Filing Include Attachments?
                    </legend>
                    {['Yes', 'No'].map(option => (
                      <div className="usa-radio usa-radio__inline" key={option}>
                        <input
                          id={`attachments-${option}`}
                          type="radio"
                          name="attachments"
                          aria-describedby="attachments-legend"
                          value={option}
                          className="usa-radio__input"
                          checked={form.attachments === (option === 'Yes')}
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateCaseAssociationRequestSequence();
                          }}
                        />
                        <label
                          htmlFor={`attachments-${option}`}
                          className="usa-radio__label"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                  <Text
                    className="usa-error-message"
                    bind="validationErrors.attachments"
                  />
                </div>
              )}

              {requestAccessHelper.documentWithObjections && (
                <div
                  className={`usa-form-group ${
                    validationErrors.objections ? 'usa-form-group--error' : ''
                  }`}
                >
                  <fieldset className="usa-fieldset">
                    <legend id="objections-legend">
                      Are There Any Objections to This Document?
                    </legend>
                    {['Yes', 'No', 'Unknown'].map(option => (
                      <div className="usa-radio usa-radio__inline" key={option}>
                        <input
                          id={`objections-${option}`}
                          type="radio"
                          aria-describedby="objections-legend"
                          name="objections"
                          className="usa-radio__input"
                          value={option}
                          checked={form.objections === option}
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                            validateCaseAssociationRequestSequence();
                          }}
                        />
                        <label
                          htmlFor={`objections-${option}`}
                          className="usa-radio__label"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                  <Text
                    className="usa-error-message"
                    bind="validationErrors.objections"
                  />
                </div>
              )}

              {requestAccessHelper.documentWithSupportingDocuments && (
                <div
                  className={classNames(
                    'usa-form-group',
                    validationErrors.hasSupportingDocuments &&
                      'usa-form-group--error',
                    !form.hasSupportingDocuments && 'margin-bottom-0',
                  )}
                >
                  <fieldset
                    className={classNames(
                      'usa-fieldset',
                      !form.hasSupportingDocuments && 'margin-bottom-0',
                    )}
                  >
                    <legend id="support-docs-legend">
                      Do You Have Any Supporting Documents for This Filing?
                    </legend>
                    {['Yes', 'No'].map(option => (
                      <div className="usa-radio usa-radio__inline" key={option}>
                        <input
                          id={`supporting-documents-${option}`}
                          type="radio"
                          name="hasSupportingDocuments"
                          className="usa-radio__input"
                          aria-describedby="support-docs-legend"
                          value={option}
                          checked={
                            form.hasSupportingDocuments === (option === 'Yes')
                          }
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateCaseAssociationRequestSequence();
                          }}
                        />
                        <label
                          htmlFor={`supporting-documents-${option}`}
                          className="usa-radio__label"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                  <Text
                    className="usa-error-message"
                    bind="validationErrors.hasSupportingDocuments"
                  />
                </div>
              )}

              {form.hasSupportingDocuments && (
                <div
                  className={classNames(
                    'usa-form-group',
                    validationErrors.supportingDocument &&
                      'usa-form-group--error',
                    !form.supportingDocument && 'margin-bottom-0',
                  )}
                >
                  <label
                    htmlFor="supporting-document"
                    id="supporting-document-label"
                    className="usa-label"
                  >
                    Select Supporting Document
                  </label>
                  <select
                    name="supportingDocument"
                    id="supporting-document"
                    aria-describedby="supporting-document-label"
                    className={`usa-select ${
                      validationErrors.supportingDocument
                        ? 'usa-select--error'
                        : ''
                    }`}
                    onChange={e => {
                      updateCaseAssociationFormValueSequence({
                        key: 'supportingDocumentMetadata.category',
                        value: 'Supporting Document',
                      });
                      updateCaseAssociationFormValueSequence({
                        key: 'supportingDocumentMetadata.documentType',
                        value: e.target.value,
                      });
                      updateCaseAssociationFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateCaseAssociationRequestSequence();
                    }}
                    value={form.supportingDocument || ''}
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
                    className="usa-error-message"
                    bind="validationErrors.supportingDocument"
                  />
                </div>
              )}

              {fileDocumentHelper.showSupportingDocumentFreeText && (
                <div
                  className={`usa-form-group ${
                    validationErrors.supportingDocumentFreeText
                      ? 'usa-form-group--error'
                      : ''
                  }`}
                >
                  <label
                    htmlFor="supporting-document-free-text"
                    id="supporting-document-free-text-label"
                    className="usa-label"
                  >
                    Supporting Document Signed By
                  </label>
                  <input
                    id="supporting-document-free-text"
                    type="text"
                    aria-describedby="supporting-document-free-text-label"
                    name="supportingDocumentFreeText"
                    autoCapitalize="none"
                    className="usa-input"
                    value={form.supportingDocumentFreeText || ''}
                    onChange={e => {
                      updateCaseAssociationFormValueSequence({
                        key: 'supportingDocumentMetadata.freeText',
                        value: e.target.value,
                      });
                      updateCaseAssociationFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      validateCaseAssociationRequestSequence();
                    }}
                  />
                  <Text
                    className="usa-error-message"
                    bind="validationErrors.supportingDocumentFreeText"
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
                    htmlFor="supporting-document-file"
                    id="supporting-document-file-label"
                    className={
                      'usa-label ustc-upload with-hint ' +
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
                  <span className="usa-hint">
                    File must be in PDF format (.pdf). Max file size{' '}
                    {constants.MAX_FILE_SIZE_MB}MB.
                  </span>
                  <StateDrivenFileInput
                    id="supporting-document-file"
                    name="supportingDocumentFile"
                    aria-describedby="supporting-document-file-label"
                    updateFormValueSequence="updateCaseAssociationFormValueSequence"
                    validationSequence="validateCaseAssociationRequestSequence"
                  />
                  <Text
                    className="usa-error-message"
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
