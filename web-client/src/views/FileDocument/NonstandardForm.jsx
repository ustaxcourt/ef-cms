import { Text } from '../../ustc-ui/Text/Text';
import { TrialCity } from '../StartCase/TrialCity';
import { connect } from '@cerebral/react';
import { get } from 'lodash';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const NonstandardForm = connect(
  {
    caseDetail: state.caseDetail,
    form: state.form,
    helper: state[props.helper],
    level: props.level,
    namespace: props.namespace,
    trialCitiesHelper: state.trialCitiesHelper,
    updateSequence: sequences[props.updateSequence],
    validateSequence: sequences[props.validateSequence],
    validationErrors: state[props.validationErrors],
  },
  ({
    caseDetail,
    form,
    helper,
    level,
    namespace,
    trialCitiesHelper,
    updateSequence,
    validateSequence,
    validationErrors,
  }) => {
    namespace = namespace ? `${namespace}.` : '';
    return (
      <div className="nonstandard-form">
        {helper[level].showTextInput && (
          <div
            className={`usa-form-group ${
              validationErrors && validationErrors.freeText
                ? 'usa-form-group--error'
                : ''
            }`}
          >
            <label className="usa-label" htmlFor={`${namespace}free-text`}>
              {helper[level].textInputLabel}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id={`${namespace}free-text`}
              name={`${namespace}freeText`}
              type="text"
              value={get(form, `${namespace}freeText`, '')}
              onBlur={() => {
                validateSequence();
              }}
              onChange={e => {
                updateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <Text
              bind={`validationErrors.${namespace}freeText`}
              className="usa-error-message"
            />
          </div>
        )}

        {helper[level].showTextInput2 && (
          <div
            className={`usa-form-group ${
              validationErrors && validationErrors.freeText2
                ? 'usa-form-group--error'
                : ''
            }`}
          >
            <label className="usa-label" htmlFor={`${namespace}free-text2`}>
              {helper[level].textInputLabel2}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id={`${namespace}free-text2`}
              name={`${namespace}freeText2`}
              type="text"
              value={get(form, `${namespace}freeText2`, '')}
              onBlur={() => {
                validateSequence();
              }}
              onChange={e => {
                updateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <Text
              bind={`validationErrors.${namespace}freeText2`}
              className="usa-error-message"
            />
          </div>
        )}

        {helper[level].previousDocumentSelectLabel && (
          <div
            className={`usa-form-group ${
              validationErrors && validationErrors.previousDocument
                ? 'usa-form-group--error'
                : ''
            }`}
          >
            <label
              className="usa-label"
              htmlFor={`${namespace}previous-document`}
            >
              {helper[level].previousDocumentSelectLabel}
            </label>
            <select
              aria-label="previousDocument"
              className={`usa-select ${
                validationErrors && validationErrors.previousDocument
                  ? 'usa-select--error'
                  : ''
              }`}
              id={`${namespace}previous-document`}
              name={`${namespace}previousDocument`}
              value={get(form, `${namespace}previousDocument`, '')}
              onChange={e => {
                updateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateSequence();
              }}
            >
              <option value="">- Select -</option>
              {helper[level].previouslyFiledDocuments.map(
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
              bind={`validationErrors.${namespace}previousDocument`}
              className="usa-error-message"
            />
          </div>
        )}

        {helper[level].showDateFields && (
          <div
            className={
              'usa-form-group ' +
              (validationErrors && validationErrors.serviceDate
                ? 'usa-form-group--error'
                : '')
            }
          >
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend id="date-of-service-legend">Service Date</legend>
              <div className="usa-memorable-date">
                <div className="usa-form-group usa-form-group--month margin-bottom-0">
                  <label
                    aria-hidden="true"
                    className="usa-label"
                    htmlFor={`${namespace}month`}
                  >
                    MM
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="month, two digits"
                    className={
                      'usa-input usa-input-inline ' +
                      (validationErrors && validationErrors.serviceDate
                        ? 'usa-input--error'
                        : '')
                    }
                    id={`${namespace}month`}
                    max="12"
                    min="1"
                    name={`${namespace}month`}
                    type="number"
                    value={get(form, `${namespace}month`, '')}
                    onBlur={() => {
                      validateSequence();
                    }}
                    onChange={e => {
                      updateSequence({
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
                    htmlFor={`${namespace}day`}
                  >
                    DD
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="day, two digits"
                    className={
                      'usa-input usa-input-inline ' +
                      (validationErrors && validationErrors.serviceDate
                        ? 'usa-input--error'
                        : '')
                    }
                    id={`${namespace}day`}
                    max="31"
                    min="1"
                    name={`${namespace}day`}
                    type="number"
                    value={get(form, `${namespace}day`, '')}
                    onBlur={() => {
                      validateSequence();
                    }}
                    onChange={e => {
                      updateSequence({
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
                    htmlFor={`${namespace}year`}
                  >
                    YYYY
                  </label>
                  <input
                    aria-describedby="date-of-service-legend"
                    aria-label="year, four digits"
                    className={
                      'usa-input usa-input-inline ' +
                      (validationErrors && validationErrors.serviceDate
                        ? 'usa-input--error'
                        : '')
                    }
                    id={`${namespace}year`}
                    max="2100"
                    min="1900"
                    name={`${namespace}year`}
                    type="number"
                    value={get(form, `${namespace}year`, '')}
                    onBlur={() => {
                      validateSequence();
                    }}
                    onChange={e => {
                      updateSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </fieldset>
            <Text
              bind={`validationErrors.${namespace}serviceDate`}
              className="usa-error-message"
            />
          </div>
        )}

        {helper[level].showTrialLocationSelect && (
          <div
            className={`usa-form-group ${
              validationErrors && validationErrors.trialLocation
                ? 'usa-form-group--error'
                : ''
            }`}
          >
            <TrialCity
              label={helper[level].textInputLabel}
              showDefaultOption={true}
              showRegularTrialCitiesHint={false}
              showSmallTrialCitiesHint={false}
              trialCitiesByState={
                trialCitiesHelper(caseDetail.procedureType).trialCitiesByState
              }
              value={get(form, `${namespace}trialLocation`, '')}
              onChange={e => {
                updateSequence({
                  key: `${namespace}trialLocation`,
                  value: e.target.value,
                });
                validateSequence();
              }}
            />
            <Text
              bind={`validationErrors.${namespace}trialLocation`}
              className="usa-error-message"
            />
          </div>
        )}

        {helper[level].ordinalField && (
          <div
            className={
              'usa-form-group ' +
              (validationErrors && validationErrors.ordinalValue
                ? 'usa-form-group--error'
                : '')
            }
          >
            <fieldset
              className="usa-fieldset margin-bottom-0"
              id={`${namespace}ordinal-field-radios`}
            >
              <legend htmlFor={`${namespace}ordinal-field-radios`}>
                {helper[level].ordinalField}
              </legend>
              {['First', 'Second', 'Third'].map(ordinalValue => (
                <div className="usa-radio usa-radio__inline" key={ordinalValue}>
                  <input
                    checked={
                      get(form, `${namespace}ordinalValue`, '') === ordinalValue
                    }
                    className="usa-radio__input"
                    id={`${namespace}${ordinalValue}`}
                    name={`${namespace}ordinalValue`}
                    type="radio"
                    value={ordinalValue}
                    onChange={e => {
                      updateSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateSequence();
                    }}
                  />
                  <label
                    className="usa-radio__label"
                    htmlFor={`${namespace}${ordinalValue}`}
                  >
                    {ordinalValue}
                  </label>
                </div>
              ))}
              <Text
                bind={`validationErrors.${namespace}ordinalValue`}
                className="usa-error-message"
              />
            </fieldset>
          </div>
        )}
      </div>
    );
  },
);
