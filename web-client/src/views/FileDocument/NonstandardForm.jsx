import { SecondaryDocumentType } from './SecondaryDocumentType';
import { SecondaryDocumentTypeReadOnly } from './SecondaryDocumentTypeReadOnly';
import { Text } from '../../ustc-ui/Text/Text';
import { TrialCity } from '../StartCase/TrialCity';
import { connect } from '@cerebral/react';
import { get } from 'lodash';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const NonstandardForm = connect(
  {
    form: state.form,
    level: props.level,
    namespace: props.namespace,
    screenMetadata: state.screenMetadata,
    selectDocumentTypeHelper: state.selectDocumentTypeHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateSelectDocumentTypeSequence:
      sequences.validateSelectDocumentTypeSequence,
    validationErrors: state[props.validationErrors],
  },
  ({
    selectDocumentTypeHelper,
    form,
    level,
    namespace,
    screenMetadata,
    updateFormValueSequence,
    validationErrors,
    validateSelectDocumentTypeSequence,
  }) => {
    namespace = namespace ? `${namespace}.` : '';
    return (
      <React.Fragment>
        {selectDocumentTypeHelper[level].showTextInput && (
          <div
            className={`ustc-form-group ${
              validationErrors && validationErrors.freeText
                ? 'usa-input-error'
                : ''
            }`}
          >
            <label htmlFor={`${namespace}free-text`}>
              {selectDocumentTypeHelper[level].textInputLabel}
            </label>
            <input
              id={`${namespace}free-text`}
              type="text"
              name={`${namespace}freeText`}
              autoCapitalize="none"
              value={get(form, `${namespace}freeText`, '')}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                validateSelectDocumentTypeSequence();
              }}
            />
            <Text
              className="usa-input-error-message"
              bind={`validationErrors.${namespace}freeText`}
            />
          </div>
        )}

        {selectDocumentTypeHelper[level].previousDocumentSelectLabel && (
          <div
            className={`ustc-form-group ${
              validationErrors && validationErrors.previousDocument
                ? 'usa-input-error'
                : ''
            }`}
          >
            <label htmlFor={`${namespace}previous-document`}>
              {selectDocumentTypeHelper[level].previousDocumentSelectLabel}
            </label>
            <select
              name={`${namespace}previousDocument`}
              id={`${namespace}previous-document`}
              value={get(form, `${namespace}previousDocument`, '')}
              aria-label="previousDocument"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateSelectDocumentTypeSequence();
              }}
            >
              <option value="">- Select -</option>
              {selectDocumentTypeHelper[level].previouslyFiledDocuments.map(
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

        {selectDocumentTypeHelper[level].showDateFields && (
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
                    value={get(form, `${namespace}month`, '')}
                    type="number"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      validateSelectDocumentTypeSequence();
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
                      'usa-input-inline' +
                      (validationErrors && validationErrors.serviceDate
                        ? '-error'
                        : '')
                    }
                    id={`${namespace}day`}
                    max="31"
                    min="1"
                    name={`${namespace}day`}
                    value={get(form, `${namespace}day`, '')}
                    type="number"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      validateSelectDocumentTypeSequence();
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
                    value={get(form, `${namespace}year`, '')}
                    name={`${namespace}year`}
                    type="number"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      validateSelectDocumentTypeSequence();
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

        {selectDocumentTypeHelper[level].showTrialLocationSelect && (
          <div
            className={`ustc-form-group ${
              validationErrors && validationErrors.trialLocation
                ? 'usa-input-error'
                : ''
            }`}
          >
            <TrialCity
              label={selectDocumentTypeHelper[level].textInputLabel}
              showSmallTrialCitiesHint={false}
              showRegularTrialCitiesHint={false}
              showDefaultOption={true}
              value={get(form, `${namespace}trialLocation`, '')}
              trialCitiesByState={selectDocumentTypeHelper[level].trialCities}
              onChange={e => {
                updateFormValueSequence({
                  key: `${namespace}trialLocation`,
                  value: e.target.value,
                });
                validateSelectDocumentTypeSequence();
              }}
            />
            <Text
              className="usa-input-error-message"
              bind={`validationErrors.${namespace}trialLocation`}
            />
          </div>
        )}

        {selectDocumentTypeHelper[level].ordinalField && (
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
                {selectDocumentTypeHelper[level].ordinalField}
              </legend>
              <ul className="usa-unstyled-list">
                {['First', 'Second', 'Third'].map(ordinalValue => (
                  <li key={ordinalValue}>
                    <input
                      id={`${namespace}${ordinalValue}`}
                      type="radio"
                      name={`${namespace}ordinalValue`}
                      value={ordinalValue}
                      checked={
                        get(form, `${namespace}ordinalValue`, '') ===
                        ordinalValue
                      }
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateSelectDocumentTypeSequence();
                      }}
                    />
                    <label htmlFor={`${namespace}${ordinalValue}`}>
                      {ordinalValue}
                    </label>
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

        {selectDocumentTypeHelper[level].showSecondaryDocumentSelect &&
          !screenMetadata.isSecondaryDocumentTypeSelected && (
            <SecondaryDocumentType />
          )}

        {selectDocumentTypeHelper[level].showSecondaryDocumentSelect &&
          screenMetadata.isSecondaryDocumentTypeSelected && (
            <SecondaryDocumentTypeReadOnly />
          )}
      </React.Fragment>
    );
  },
);
