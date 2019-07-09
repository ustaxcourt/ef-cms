import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const Country = connect(
  {
    constants: state.constants,
    data: state[props.bind],
    type: props.type,
    updateFormValueSequence: sequences[props.onChange],
    validateStartCaseSequence: sequences[props.onBlur],
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    data,
    type,
    updateFormValueSequence,
    validateStartCaseSequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <div
          className={
            'usa-form-group ' +
            (validationErrors &&
            validationErrors[type] &&
            validationErrors[type].countryType
              ? 'usa-form-group--error'
              : '')
          }
        >
          <label className="usa-label" htmlFor={`${type}.countryType`}>
            Country
          </label>
          <select
            className={`${type}-country-type usa-select`}
            id={`${type}.countryType`}
            name={`${type}.countryType`}
            value={data[type].countryType}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateStartCaseSequence();
            }}
          >
            <option value={constants.COUNTRY_TYPES.DOMESTIC}>
              - United States -
            </option>
            <option value={constants.COUNTRY_TYPES.INTERNATIONAL}>
              - International -
            </option>
          </select>
          <Text
            bind={`validationErrors.${type}.countryType`}
            className="usa-error-message"
          />
        </div>
        {data[type].countryType === constants.COUNTRY_TYPES.INTERNATIONAL && (
          <div
            className={
              'usa-form-group ' +
              (validationErrors &&
              validationErrors[type] &&
              validationErrors[type].country
                ? 'usa-form-group--error'
                : '')
            }
          >
            <label className="usa-label" htmlFor={`${type}.country`}>
              Country Name
            </label>
            <input
              autoCapitalize="none"
              className={`${type}-country usa-input`}
              id={`${type}.country`}
              name={`${type}.country`}
              type="text"
              value={data[type].country || ''}
              onBlur={() => {
                validateStartCaseSequence();
              }}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <Text
              bind={`validationErrors.${type}.country`}
              className="usa-error-message"
            />
          </div>
        )}
      </React.Fragment>
    );
  },
);
