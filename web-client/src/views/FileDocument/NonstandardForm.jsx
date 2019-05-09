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
    caseDetail: state.caseDetail,
    form: state.form,
    helper: state[props.helper],
    level: props.level,
    namespace: props.namespace,
    screenMetadata: state.screenMetadata,
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
    screenMetadata,
    trialCitiesHelper,
    updateSequence,
    validationErrors,
    validateSequence,
  }) => {
    namespace = namespace ? `${namespace}.` : '';
    return (
      <React.Fragment>
        {helper[level].showTextInput && (
          <div
            className={`usa-form-group ${
              validationErrors && validationErrors.freeText
                ? 'usa-form-group--error'
                : ''
            }`}
          >
            <label htmlFor={`${namespace}free-text`} className="usa-label">
              {helper[level].textInputLabel}
            </label>
            <input
              id={`${namespace}free-text`}
              type="text"
              name={`${namespace}freeText`}
              autoCapitalize="none"
              className="usa-input"
              value={get(form, `${namespace}freeText`, '')}
              onChange={e => {
                updateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                validateSequence();
              }}
            />
            <Text
              className="usa-error-message"
              bind={`validationErrors.${namespace}freeText`}
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
            <label htmlFor={`${namespace}free-text2`} className="usa-label">
              {helper[level].textInputLabel2}
            </label>
            <input
              id={`${namespace}free-text2`}
              type="text"
              name={`${namespace}freeText2`}
              autoCapitalize="none"
              className="usa-input"
              value={get(form, `${namespace}freeText2`, '')}
              onChange={e => {
                updateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                validateSequence();
              }}
            />
            <Text
              className="usa-error-message"
              bind={`validationErrors.${namespace}freeText2`}
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
              htmlFor={`${namespace}previous-document`}
              className="usa-label"
            >
              {helper[level].previousDocumentSelectLabel}
            </label>
            <select
              name={`${namespace}previousDocument`}
              id={`${namespace}previous-document`}
              value={get(form, `${namespace}previousDocument`, '')}
              aria-label="previousDocument"
              className={`usa-select ${
                validationErrors && validationErrors.previousDocument
                  ? 'usa-select--error'
                  : ''
              }`}
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
              className="usa-error-message"
              bind={`validationErrors.${namespace}previousDocument`}
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
            <fieldset className="usa-fieldset">
              <legend id="date-of-service-legend">Service Date</legend>
              <div className="usa-memorable-date">
                <div className="usa-form-group usa-form-group--month">
                  <label
                    htmlFor={`${namespace}month`}
                    className="usa-label"
                    aria-hidden="true"
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
                    value={get(form, `${namespace}month`, '')}
                    type="number"
                    onChange={e => {
                      updateSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      validateSequence();
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--day">
                  <label
                    htmlFor={`${namespace}day`}
                    className="usa-label"
                    aria-hidden="true"
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
                    value={get(form, `${namespace}day`, '')}
                    type="number"
                    onChange={e => {
                      updateSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      validateSequence();
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--year">
                  <label
                    htmlFor={`${namespace}year`}
                    className="usa-label"
                    aria-hidden="true"
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
                    value={get(form, `${namespace}year`, '')}
                    name={`${namespace}year`}
                    type="number"
                    onChange={e => {
                      updateSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      validateSequence();
                    }}
                  />
                </div>
              </div>
            </fieldset>
            <Text
              className="usa-error-message"
              bind={`validationErrors.${namespace}serviceDate`}
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
              showSmallTrialCitiesHint={false}
              showRegularTrialCitiesHint={false}
              showDefaultOption={true}
              value={get(form, `${namespace}trialLocation`, '')}
              trialCitiesByState={
                trialCitiesHelper(caseDetail.procedureType).trialCitiesByState
              }
              onChange={e => {
                updateSequence({
                  key: `${namespace}trialLocation`,
                  value: e.target.value,
                });
                validateSequence();
              }}
            />
            <Text
              className="usa-error-message"
              bind={`validationErrors.${namespace}trialLocation`}
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
              id={`${namespace}ordinal-field-radios`}
              className="usa-fieldset"
            >
              <legend htmlFor={`${namespace}ordinal-field-radios`}>
                {helper[level].ordinalField}
              </legend>
              {['First', 'Second', 'Third'].map(ordinalValue => (
                <div className="usa-radio usa-radio__inline" key={ordinalValue}>
                  <input
                    id={`${namespace}${ordinalValue}`}
                    type="radio"
                    name={`${namespace}ordinalValue`}
                    value={ordinalValue}
                    className="usa-radio__input"
                    checked={
                      get(form, `${namespace}ordinalValue`, '') === ordinalValue
                    }
                    onChange={e => {
                      updateSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateSequence();
                    }}
                  />
                  <label
                    htmlFor={`${namespace}${ordinalValue}`}
                    className="usa-radio__label"
                  >
                    {ordinalValue}
                  </label>
                </div>
              ))}
              <Text
                className="usa-error-message"
                bind={`validationErrors.${namespace}ordinalValue`}
              />
            </fieldset>
          </div>
        )}

        {helper[level].showSecondaryDocumentSelect &&
          !screenMetadata.isSecondaryDocumentTypeSelected && (
            <SecondaryDocumentType />
          )}

        {helper[level].showSecondaryDocumentSelect &&
          screenMetadata.isSecondaryDocumentTypeSelected && (
            <SecondaryDocumentTypeReadOnly />
          )}
      </React.Fragment>
    );
  },
);
