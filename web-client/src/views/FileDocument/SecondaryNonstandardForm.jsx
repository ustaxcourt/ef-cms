import { Text } from '../../ustc-ui/Text/Text';
import { TrialCity } from '../StartCase/TrialCity';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondaryNonstandardForm = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({ fileDocumentHelper, form, updateFormValueSequence, validationErrors }) => {
    return (
      <React.Fragment>
        {fileDocumentHelper.secondary.showTextInput && (
          <div
            className={`ustc-form-group ${
              validationErrors.previousDocument ? 'usa-input-error' : ''
            }`}
          >
            <label htmlFor="free-text">
              {fileDocumentHelper.secondary.textInputLabel}
            </label>
            <input
              id="free-text"
              type="text"
              name="freeText"
              autoCapitalize="none"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <Text
              className="usa-input-error-message"
              bind="validationErrors.freeText"
            />
          </div>
        )}

        {fileDocumentHelper.secondary.previousDocumentSelectLabel && (
          <div
            className={`ustc-form-group ${
              validationErrors.previousDocument ? 'usa-input-error' : ''
            }`}
          >
            <label htmlFor="responding-to-document">
              {fileDocumentHelper.secondary.previousDocumentSelectLabel}
            </label>
            <select
              name="previousDocument"
              id="responding-to-document"
              aria-label="previousDocument"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                //validateSelectDocumentTypeSequence();
              }}
              value={form.previousDocument}
            >
              <option value="">- Select -</option>
              {fileDocumentHelper.secondary.previouslyFiledDocuments.map(
                documentTitle => {
                  return (
                    <option key={documentTitle} value={documentTitle}>
                      {documentTitle}
                    </option>
                  );
                },
              )}
            </select>
            <Text
              className="usa-input-error-message"
              bind="validationErrors.previousDocument"
            />
          </div>
        )}

        {fileDocumentHelper.secondary.showDateFields && (
          <div
            className={
              'ustc-form-group ' +
              (validationErrors.serviceDate ? 'usa-input-error' : '')
            }
          >
            <fieldset>
              <legend id="date-of-service-legend">Service Date</legend>
              <div className="usa-date-of-birth">
                <div className="usa-form-group usa-form-group-month">
                  <label htmlFor="date-of-service-month" aria-hidden="true">
                    MM
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="month, two digits"
                    className={
                      'usa-input-inline' +
                      (validationErrors.serviceDate ? '-error' : '')
                    }
                    id="date-of-service-month"
                    max="12"
                    min="1"
                    name="serviceDateMonth"
                    type="number"
                    value={form.serviceDateMonth || ''}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group-day">
                  <label htmlFor="date-of-service-day" aria-hidden="true">
                    DD
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="day, two digits"
                    className={
                      'usa-input-inline' +
                      (validationErrors.serviceDate ? '-error' : '')
                    }
                    id="date-of-service-day"
                    max="31"
                    min="1"
                    name="serviceDateDay"
                    type="number"
                    value={form.serviceDateDay || ''}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group-year">
                  <label htmlFor="date-of-service-year" aria-hidden="true">
                    YYYY
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="year, four digits"
                    className={
                      'usa-input-inline' +
                      (validationErrors.serviceDate ? '-error' : '')
                    }
                    id="date-of-service-year"
                    max="2100"
                    min="1900"
                    name="serviceDateYear"
                    type="number"
                    value={form.serviceDateYear || ''}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </fieldset>
            {validationErrors.serviceDate && (
              <div className="usa-input-error-message" role="alert">
                {validationErrors.serviceDate}
              </div>
            )}
          </div>
        )}

        {fileDocumentHelper.secondary.showTrialLocationSelect && (
          <div
            className={`ustc-form-group ${
              validationErrors.trialLocation ? 'usa-input-error' : ''
            }`}
          >
            <TrialCity
              label={fileDocumentHelper.secondary.textInputLabel}
              showSmallTrialCitiesHint={false}
              showRegularTrialCitiesHint={false}
              showDefaultOption={true}
              value={form.trialLocation}
              trialCitiesByState={fileDocumentHelper.secondary.trialCities}
              onChange={e => {
                updateFormValueSequence({
                  key: 'trialLocation',
                  value: e.target.value,
                });
              }}
            />
            <Text
              className="usa-input-error-message"
              bind="validationErrors.previousDocument"
            />
          </div>
        )}

        {fileDocumentHelper.secondary.ordinalField && (
          <div
            className={
              'ustc-form-group ' +
              (validationErrors.ordinalValue ? 'usa-input-error' : '')
            }
          >
            <fieldset
              id="ordinal-field-radios"
              className="usa-fieldset-inputs usa-sans"
            >
              <legend htmlFor="ordinal-field-radios">
                {fileDocumentHelper.secondary.ordinalField}
              </legend>
              <ul className="usa-unstyled-list">
                {['First', 'Second', 'Third'].map((ordinalValue, idx) => (
                  <li key={ordinalValue}>
                    <input
                      id={ordinalValue}
                      data-type={ordinalValue}
                      type="radio"
                      name="ordinalValue"
                      value={ordinalValue}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                    <label id={`filing-type-${idx}`} htmlFor={ordinalValue}>
                      {ordinalValue}
                    </label>
                  </li>
                ))}
              </ul>
              <Text
                className="usa-input-error-message"
                bind="validationErrors.ordinalValue"
              />
            </fieldset>
          </div>
        )}
      </React.Fragment>
    );
  },
);
