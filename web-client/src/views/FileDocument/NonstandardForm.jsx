import { props, sequences, state } from 'cerebral';

import { ChooseSecondaryDocumentType } from './ChooseSecondaryDocumentType';
import React from 'react';
import { SelectedSecondaryDocumentType } from './SelectedSecondaryDocumentType';
import { Text } from '../../ustc-ui/Text/Text';
import { TrialCity } from '../StartCase/TrialCity';
import { connect } from '@cerebral/react';

export const NonstandardForm = connect(
  {
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    level: props.level,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state[props.validationErrors],
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
              validationErrors && validationErrors.freeText
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
              bind="validationErrors.freeText"
            />
          </div>
        )}

        {fileDocumentHelper[level].previousDocumentSelectLabel && (
          <div
            className={`ustc-form-group ${
              validationErrors && validationErrors.previousDocument
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
              bind="validationErrors.previousDocument"
            />
          </div>
        )}

        {fileDocumentHelper[level].showDateFields && (
          <div
            className={
              'ustc-form-group ' +
              (validationErrors && validationErrors.serviceDate
                ? 'usa-input-error'
                : '')
            }
          >
            <fieldset>
              <legend id="date-of-service-legend">Service Date</legend>
              <div className="usa-date-of-birth">
                <div className="usa-form-group usa-form-group-month">
                  <label htmlFor={`${level}.month`} aria-hidden="true">
                    MM
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="month, two digits"
                    className={
                      'usa-input-inline' +
                      (validationErrors && validationErrors.serviceDate
                        ? '-error'
                        : '')
                    }
                    id={`${level}.month`}
                    max="12"
                    min="1"
                    name={`${level}.month`}
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
                  <label htmlFor={`${level}.day`} aria-hidden="true">
                    DD
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="day, two digits"
                    className={
                      'usa-input-inline ' +
                      (validationErrors && validationErrors.serviceDate
                        ? '-error'
                        : '')
                    }
                    id={`${level}.day`}
                    max="31"
                    min="1"
                    name={`${level}.day`}
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
                  <label htmlFor={`${level}.year`} aria-hidden="true">
                    YYYY
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="year, four digits"
                    className={
                      'usa-input-inline' +
                      (validationErrors && validationErrors.serviceDate
                        ? '-error'
                        : '')
                    }
                    id={`${level}.year`}
                    max="2100"
                    min="1900"
                    name={`${level}.year`}
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
              bind="validationErrors.serviceDate"
            />
          </div>
        )}

        {fileDocumentHelper[level].showTrialLocationSelect && (
          <div
            className={`ustc-form-group ${
              validationErrors && validationErrors.trialLocation
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
              bind="validationErrors.trialLocation"
            />
          </div>
        )}

        {fileDocumentHelper[level].ordinalField && (
          <div
            className={
              'ustc-form-group ' +
              (validationErrors && validationErrors.ordinalValue
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
                {['First', 'Second', 'Third'].map(ordinalValue => (
                  <li key={ordinalValue}>
                    <input
                      id={`${level}.${ordinalValue}`}
                      type="radio"
                      name={`${level}.ordinalValue`}
                      value={ordinalValue}
                      checked={
                        form[level] && ordinalValue === form[level].ordinalValue
                      }
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                    <label htmlFor={`${level}.${ordinalValue}`}>
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
