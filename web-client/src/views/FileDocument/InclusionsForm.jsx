import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const InclusionsForm = connect(
  {
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
  }) => {
    return (
      <React.Fragment>
        <div
          className={`usa-form-group ${
            !fileDocumentHelper.showObjection && !form.certificateOfService
              ? 'margin-bottom-0'
              : ''
          }`}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend id="extra-items-legend">
              Select Extra Items Included With Document
              <button className="usa-button usa-button--unstyled margin-top-2 margin-bottom-105">
                <FontAwesomeIcon
                  className="margin-right-05"
                  icon="question-circle"
                  size="1x"
                />
                What can I include with my document?
              </button>
            </legend>
            <div className="usa-checkbox">
              <input
                checked={form.exhibits || false}
                className="usa-checkbox__input"
                id="exhibits"
                name="exhibits"
                type="checkbox"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateExternalDocumentInformationSequence();
                }}
              />
              <label className="usa-checkbox__label" htmlFor="exhibits">
                Exhibits
              </label>
            </div>

            <div className="usa-checkbox">
              <input
                checked={form.attachments || false}
                className="usa-checkbox__input"
                id="attachments"
                name="attachments"
                type="checkbox"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateExternalDocumentInformationSequence();
                }}
              />
              <label className="usa-checkbox__label" htmlFor="attachments">
                Attachments
              </label>
            </div>

            <div className="usa-checkbox">
              <input
                checked={form.certificateOfService || false}
                className="usa-checkbox__input"
                id="certificateOfService"
                name="certificateOfService"
                type="checkbox"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateExternalDocumentInformationSequence();
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor="certificateOfService"
              >
                Certificate Of Service
              </label>
            </div>
          </fieldset>
        </div>
        {form.certificateOfService && (
          <div
            className={`usa-form-group ${
              validationErrors.certificateOfServiceDate
                ? 'usa-form-group--error'
                : ''
            } ${!fileDocumentHelper.showObjection ? 'margin-bottom-0' : ''}`}
          >
            <fieldset className="service-date usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="service-date-legend">
                Service Date
              </legend>
              <div className="usa-memorable-date">
                <div className="usa-form-group usa-form-group--month">
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
                      validateExternalDocumentInformationSequence();
                    }}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--day">
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
                      validateExternalDocumentInformationSequence();
                    }}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--year">
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
                      validateExternalDocumentInformationSequence();
                    }}
                    onChange={e => {
                      updateFileDocumentWizardFormValueSequence({
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
        {fileDocumentHelper.showObjection && (
          <div
            className={`usa-form-group margin-bottom-0 ${
              validationErrors.objections ? 'usa-form-group--error' : ''
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
                      updateFileDocumentWizardFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateExternalDocumentInformationSequence();
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
      </React.Fragment>
    );
  },
);
