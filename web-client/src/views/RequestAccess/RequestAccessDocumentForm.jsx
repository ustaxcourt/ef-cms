import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RequestAccessDocumentForm = connect(
  {
    constants: state.constants,
    form: state.form,
    requestAccessHelper: state.requestAccessHelper,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
    validationErrors: state.validationErrors,
  },
  ({
    requestAccessHelper,
    form,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
    validationErrors,
    constants,
  }) => {
    return (
      <React.Fragment>
        <h3>Tell Us About This Document</h3>
        <div className="blue-container">
          <div className="grid-container padding-x-0">
            <div className="tablet:grid-col-7 push-right">
              <div
                id="document-upload-hint"
                className="alert-gold add-bottom-margin"
              >
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
                  <span className="success-message">
                    <FontAwesomeIcon icon="check-circle" size="sm" />
                  </span>
                </label>
                <span className="usa-form-hint">
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
                  className={
                    validationErrors.certificateOfServiceDate
                      ? 'usa-form-group--error'
                      : ''
                  }
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
              {form.documentType === 'Substitution of Counsel' && (
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
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
