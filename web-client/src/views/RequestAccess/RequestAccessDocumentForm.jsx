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
    constants,
    fileDocumentHelper,
    form,
    requestAccessHelper,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
    validationErrors,
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
                  className={
                    'usa-label ustc-upload with-hint' +
                    (requestAccessHelper.showPrimaryDocumentValid
                      ? 'validated'
                      : '')
                  }
                  htmlFor="primary-document"
                  id="primary-document-label"
                >
                  Upload your document{' '}
                  <span className="success-message padding-left-1">
                    <FontAwesomeIcon icon="check-circle" size="sm" />
                  </span>
                </label>
                <span className="usa-hint">
                  File must be in PDF format (.pdf). Max file size{' '}
                  {constants.MAX_FILE_SIZE_MB}MB.
                </span>
                <StateDrivenFileInput
                  aria-describedby="primary-document-label"
                  id="primary-document"
                  name="primaryDocumentFile"
                  updateFormValueSequence="updateCaseAssociationFormValueSequence"
                  validationSequence="validateCaseAssociationRequestSequence"
                />
                <Text
                  bind="validationErrors.primaryDocumentFile"
                  className="usa-error-message"
                />
              </div>
              <div
                className={`usa-form-group ${
                  validationErrors.certificateOfService
                    ? 'usa-form-group--error'
                    : ''
                } ${
                  !form.certificateOfService &&
                  !requestAccessHelper.documentWithExhibits &&
                  !requestAccessHelper.documentWithObjections
                    ? 'margin-bottom-0'
                    : ''
                }`}
              >
                <fieldset className="usa-fieldset margin-bottom-0">
                  <legend>
                    Does Your Filing Include A Certificate of Service?
                  </legend>
                  {['Yes', 'No'].map(option => (
                    <div className="usa-radio usa-radio__inline" key={option}>
                      <input
                        checked={
                          form.certificateOfService === (option === 'Yes')
                        }
                        className="usa-radio__input"
                        id={`certificate-${option}`}
                        name="certificateOfService"
                        type="radio"
                        value={option}
                        onChange={e => {
                          updateCaseAssociationFormValueSequence({
                            key: e.target.name,
                            value: e.target.value === 'Yes',
                          });
                          validateCaseAssociationRequestSequence();
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={`certificate-${option}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </fieldset>
                <Text
                  bind="validationErrors.certificateOfService"
                  className="usa-error-message"
                />
              </div>
              {form.certificateOfService && (
                <div
                  className={`usa-form-group ${
                    validationErrors.certificateOfServiceDate
                      ? 'usa-form-group--error'
                      : ''
                  } ${
                    !requestAccessHelper.documentWithExhibits &&
                    !requestAccessHelper.documentWithObjections
                      ? 'margin-bottom-0'
                      : ''
                  }`}
                >
                  <fieldset className="service-date usa-fieldset margin-bottom-0">
                    <legend className="usa-legend" id="service-date-legend">
                      Service Date
                    </legend>
                    <div className="usa-memorable-date">
                      <div className="usa-form-group usa-form-group--month margin-bottom-0">
                        <label
                          aria-hidden="true"
                          className="usa-label"
                          htmlFor="service-date-month"
                        >
                          MM
                        </label>
                        <input
                          aria-describedby="service-date-legend"
                          aria-label="month, two digits"
                          className="usa-input usa-input-inline"
                          id="service-date-month"
                          max="12"
                          min="1"
                          name="certificateOfServiceMonth"
                          type="number"
                          value={form.certificateOfServiceMonth}
                          onBlur={() => {
                            validateCaseAssociationRequestSequence();
                          }}
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--day margin-bottom-0">
                        <label
                          aria-hidden="true"
                          className="usa-label"
                          htmlFor="service-date-day"
                        >
                          DD
                        </label>
                        <input
                          aria-describedby="service-date-legend"
                          aria-label="day, two digits"
                          className="usa-input usa-input-inline"
                          id="service-date-day"
                          max="31"
                          min="1"
                          name="certificateOfServiceDay"
                          type="number"
                          value={form.certificateOfServiceDay}
                          onBlur={() => {
                            validateCaseAssociationRequestSequence();
                          }}
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="usa-form-group usa-form-group--year margin-bottom-0">
                        <label
                          aria-hidden="true"
                          className="usa-label"
                          htmlFor="service-date-year"
                        >
                          YYYY
                        </label>
                        <input
                          aria-describedby="service-date-legend"
                          aria-label="year, four digits"
                          className="usa-input usa-input-inline"
                          id="service-date-year"
                          max="2100"
                          min="1900"
                          name="certificateOfServiceYear"
                          type="number"
                          value={form.certificateOfServiceYear}
                          onBlur={() => {
                            validateCaseAssociationRequestSequence();
                          }}
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </fieldset>
                  <Text
                    bind="validationErrors.certificateOfServiceDate"
                    className="usa-error-message"
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
                          aria-describedby="exhibits-legend"
                          checked={form.exhibits === (option === 'Yes')}
                          className="usa-radio__input"
                          id={`exhibits-${option}`}
                          name="exhibits"
                          type="radio"
                          value={option}
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateCaseAssociationRequestSequence();
                          }}
                        />
                        <label
                          className="usa-radio__label"
                          htmlFor={`exhibits-${option}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                  <Text
                    bind="validationErrors.exhibits"
                    className="usa-error-message"
                  />
                </div>
              )}

              {requestAccessHelper.documentWithAttachments && (
                <div
                  className={`usa-form-group ${
                    validationErrors.attachments ? 'usa-form-group--error' : ''
                  } ${
                    !requestAccessHelper.documentWithObjections
                      ? 'margin-bottom-0'
                      : ''
                  }`}
                >
                  <fieldset className="usa-fieldset margin-bottom-0">
                    <legend id="attachments-legend">
                      Does Your Filing Include Attachments?
                    </legend>
                    {['Yes', 'No'].map(option => (
                      <div className="usa-radio usa-radio__inline" key={option}>
                        <input
                          aria-describedby="attachments-legend"
                          checked={form.attachments === (option === 'Yes')}
                          className="usa-radio__input"
                          id={`attachments-${option}`}
                          name="attachments"
                          type="radio"
                          value={option}
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateCaseAssociationRequestSequence();
                          }}
                        />
                        <label
                          className="usa-radio__label"
                          htmlFor={`attachments-${option}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                  <Text
                    bind="validationErrors.attachments"
                    className="usa-error-message"
                  />
                </div>
              )}

              {requestAccessHelper.documentWithObjections && (
                <div
                  className={`usa-form-group ${
                    validationErrors.objections ? 'usa-form-group--error' : ''
                  } ${
                    !requestAccessHelper.documentWithSupportingDocuments
                      ? 'margin-bottom-0'
                      : ''
                  }`}
                >
                  <fieldset className="usa-fieldset margin-bottom-0">
                    <legend id="objections-legend">
                      Are There Any Objections to This Document?
                    </legend>
                    {['Yes', 'No', 'Unknown'].map(option => (
                      <div className="usa-radio usa-radio__inline" key={option}>
                        <input
                          aria-describedby="objections-legend"
                          checked={form.objections === option}
                          className="usa-radio__input"
                          id={`objections-${option}`}
                          name="objections"
                          type="radio"
                          value={option}
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                            validateCaseAssociationRequestSequence();
                          }}
                        />
                        <label
                          className="usa-radio__label"
                          htmlFor={`objections-${option}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                  <Text
                    bind="validationErrors.objections"
                    className="usa-error-message"
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
                          aria-describedby="support-docs-legend"
                          checked={
                            form.hasSupportingDocuments === (option === 'Yes')
                          }
                          className="usa-radio__input"
                          id={`supporting-documents-${option}`}
                          name="hasSupportingDocuments"
                          type="radio"
                          value={option}
                          onChange={e => {
                            updateCaseAssociationFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateCaseAssociationRequestSequence();
                          }}
                        />
                        <label
                          className="usa-radio__label"
                          htmlFor={`supporting-documents-${option}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                  <Text
                    bind="validationErrors.hasSupportingDocuments"
                    className="usa-error-message"
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
                    className="usa-label"
                    htmlFor="supporting-document"
                    id="supporting-document-label"
                  >
                    Select supporting document
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
                    bind="validationErrors.supportingDocument"
                    className="usa-error-message"
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
                      validateCaseAssociationRequestSequence();
                    }}
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
                    updateFormValueSequence="updateCaseAssociationFormValueSequence"
                    validationSequence="validateCaseAssociationRequestSequence"
                  />
                  <Text
                    bind="validationErrors.supportingDocumentFile"
                    className="usa-error-message"
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
