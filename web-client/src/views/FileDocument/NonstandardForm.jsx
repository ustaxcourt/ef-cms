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
    namespace: props.namespace,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state[props.validationErrors],
  },
  ({
    fileDocumentHelper,
    form,
    level,
    namespace,
    updateFormValueSequence,
    validationErrors,
  }) => {
    namespace = namespace ? `${namespace}.` : '';
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
            <label htmlFor={`${namespace}free-text`}>
              {fileDocumentHelper[level].textInputLabel}
            </label>
            <input
              id={`${namespace}free-text`}
              type="text"
              name={`${namespace}freeText`}
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
              bind={`validationErrors.${namespace}freeText`}
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
            <label htmlFor={`${namespace}previous-document`}>
              {fileDocumentHelper[level].previousDocumentSelectLabel}
            </label>
            <select
              name={`${namespace}previousDocument`}
              id={`${namespace}previous-document`}
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
              bind={`validationErrors.${namespace}previousDocument`}
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
                  <label htmlFor={`${namespace}month`} aria-hidden="true">
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
                    id={`${namespace}month`}
                    max="12"
                    min="1"
                    name={`${namespace}month`}
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
                  <label htmlFor={`${namespace}day`} aria-hidden="true">
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
                    id={`${namespace}day`}
                    max="31"
                    min="1"
                    name={`${namespace}day`}
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
                  <label htmlFor={`${namespace}year`} aria-hidden="true">
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
                    id={`${namespace}year`}
                    max="2100"
                    min="1900"
                    name={`${namespace}year`}
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
              bind={`validationErrors.${namespace}serviceDate`}
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
              bind={`validationErrors.${namespace}trialLocation`}
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
              id={`${namespace}ordinal-field-radios`}
              className="usa-fieldset-inputs usa-sans"
            >
              <legend htmlFor={`${namespace}ordinal-field-radios`}>
                {fileDocumentHelper[level].ordinalField}
              </legend>
              <ul className="usa-unstyled-list">
                {['First', 'Second', 'Third'].map(ordinalValue => (
                  <li key={ordinalValue}>
                    <input
                      id={`${namespace}${ordinalValue}`}
                      type="radio"
                      name={`${namespace}ordinalValue`}
                      value={ordinalValue}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                    <label htmlFor={ordinalValue}>{ordinalValue}</label>
                  </li>
                ))}
              </ul>
              <Text
                className="usa-input-error-message"
                bind={`validationErrors.${namespace}ordinalValue`}
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
