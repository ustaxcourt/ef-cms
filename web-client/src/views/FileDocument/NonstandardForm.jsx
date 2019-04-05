import { ChooseSecondaryDocumentType } from './ChooseSecondaryDocumentType';
import { SelectedSecondaryDocumentType } from './SelectedSecondaryDocumentType';
import { Text } from '../../ustc-ui/Text/Text';
import { TrialCity } from '../StartCase/TrialCity';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const NonstandardForm = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    level: props.level,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({
    fileDocumentHelper,
    form,
    level,
    updateFormValueSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        {fileDocumentHelper[level].showTextInput && (
          <div
            className={`ustc-form-group ${
              validationErrors[level] &&
              validationErrors[level].previousDocument
                ? 'usa-input-error'
                : ''
            }`}
          >
            <label htmlFor={`${level}.free-text`}>
              {fileDocumentHelper[level].textInputLabel}
            </label>
            <input
              id={`${level}.free-text`}
              type="text"
              name={`${level}.freeText`}
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
              bind="validationErrors[level].freeText"
            />
          </div>
        )}

        {fileDocumentHelper[level].previousDocumentSelectLabel && (
          <div
            className={`ustc-form-group ${
              validationErrors[level] &&
              validationErrors[level].previousDocument
                ? 'usa-input-error'
                : ''
            }`}
          >
            <label htmlFor={`${level}.previous-document`}>
              {fileDocumentHelper[level].previousDocumentSelectLabel}
            </label>
            <select
              name={`${level}.previousDocument`}
              id={`${level}.previous-document`}
              aria-label="previousDocument"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Select -</option>
              {fileDocumentHelper[level].previouslyFiledDocuments.map(
                (documentTitle, idx) => {
                  return (
                    <option key={idx} value={documentTitle}>
                      {documentTitle}
                    </option>
                  );
                },
              )}
            </select>
            <Text
              className="usa-input-error-message"
              bind="validationErrors[level].previousDocument"
            />
          </div>
        )}

        {fileDocumentHelper[level].showDateFields && (
          <div
            className={
              'ustc-form-group ' +
              (validationErrors[level] && validationErrors[level].serviceDate
                ? 'usa-input-error'
                : '')
            }
          >
            <fieldset>
              <legend id="date-of-service-legend">Service Date</legend>
              <div className="usa-date-of-birth">
                <div className="usa-form-group usa-form-group-month">
                  <label
                    htmlFor={`${level}.date-of-service-month`}
                    aria-hidden="true"
                  >
                    MM
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="month, two digits"
                    className={
                      'usa-input-inline' +
                      (validationErrors[level] &&
                      validationErrors[level].serviceDate
                        ? '-error'
                        : '')
                    }
                    id={`${level}.date-of-service-month`}
                    max="12"
                    min="1"
                    name={`${level}.serviceDateMonth`}
                    type="number"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group-day">
                  <label
                    htmlFor={`${level}.date-of-service-day`}
                    aria-hidden="true"
                  >
                    DD
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="day, two digits"
                    className={
                      'usa-input-inline' +
                      (validationErrors[level] &&
                      validationErrors[level].serviceDate
                        ? '-error'
                        : '')
                    }
                    id={`${level}.date-of-service-day`}
                    max="31"
                    min="1"
                    name={`${level}.serviceDateDay`}
                    type="number"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group-year">
                  <label
                    htmlFor={`${level}.date-of-service-year`}
                    aria-hidden="true"
                  >
                    YYYY
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="year, four digits"
                    className={
                      'usa-input-inline' +
                      (validationErrors[level] &&
                      validationErrors[level].serviceDate
                        ? '-error'
                        : '')
                    }
                    id={`${level}.date-of-service-year`}
                    max="2100"
                    min="1900"
                    name={`${level}.serviceDateYear`}
                    type="number"
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
            <Text
              className="usa-input-error-message"
              bind="validationErrors[level].serviceDate"
            />
          </div>
        )}

        {fileDocumentHelper[level].showTrialLocationSelect && (
          <div
            className={`ustc-form-group ${
              validationErrors[level] && validationErrors[level].trialLocation
                ? 'usa-input-error'
                : ''
            }`}
          >
            <TrialCity
              label={fileDocumentHelper[level].textInputLabel}
              showSmallTrialCitiesHint={false}
              showRegularTrialCitiesHint={false}
              showDefaultOption={true}
              trialCitiesByState={fileDocumentHelper[level].trialCities}
              onChange={e => {
                updateFormValueSequence({
                  key: 'trialLocation',
                  value: e.target.value,
                });
              }}
            />
            <Text
              className="usa-input-error-message"
              bind="validationErrors[level].previousDocument"
            />
          </div>
        )}

        {fileDocumentHelper[level].ordinalField && (
          <div
            className={
              'ustc-form-group ' +
              (validationErrors[level] && validationErrors[level].ordinalValue
                ? 'usa-input-error'
                : '')
            }
          >
            <fieldset
              id={`${level}.ordinal-field-radios`}
              className="usa-fieldset-inputs usa-sans"
            >
              <legend htmlFor={`${level}.ordinal-field-radios`}>
                {fileDocumentHelper[level].ordinalField}
              </legend>
              <ul className="usa-unstyled-list">
                {['First', 'Second', 'Third'].map((ordinalValue, idx) => (
                  <li key={ordinalValue}>
                    <input
                      id={`${level}.${ordinalValue}`}
                      type="radio"
                      name={`${level}.ordinalValue`}
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
                bind="validationErrors[level].ordinalValue"
              />
            </fieldset>
          </div>
        )}

        {fileDocumentHelper[level].showSecondaryDocumentSelect &&
          form.isSecondaryDocumentTypeSelected && (
            <SelectedSecondaryDocumentType />
          )}

        {fileDocumentHelper[level].showSecondaryDocumentSelect &&
          !form.isSecondaryDocumentTypeSelected && (
            <ChooseSecondaryDocumentType />
          )}
      </React.Fragment>
    );
  },
);
