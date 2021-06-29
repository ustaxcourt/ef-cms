import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const Country = connect(
  {
    constants: state.constants,
    data: state[props.bind],
    onChangeCountryType: sequences[props.onChangeCountryType],
    type: props.type,
    updateFormValueSequence: sequences[props.onChange],
    validateStartCaseSequence: sequences[props.onBlur],
    validationErrors: state.validationErrors,
  },
  function Country({
    constants,
    data,
    onChangeCountryType,
    type,
    updateFormValueSequence,
    validateStartCaseSequence,
    validationErrors,
  }) {
    return (
      <React.Fragment>
        <FormGroup errorText={validationErrors?.[type]?.countryType}>
          <label className="usa-label" htmlFor={`${type}.countryType`}>
            Country
          </label>
          <select
            className={`${type}-country-type usa-select`}
            id={`${type}.countryType`}
            name={`${type}.countryType`}
            value={data[type].countryType}
            onChange={e => {
              const method = onChangeCountryType || updateFormValueSequence;
              method({
                key: e.target.name,
                value: e.target.value,
              });

              if (validateStartCaseSequence) {
                validateStartCaseSequence();
              }
            }}
          >
            <option value={constants.COUNTRY_TYPES.DOMESTIC}>
              - United States -
            </option>
            <option value={constants.COUNTRY_TYPES.INTERNATIONAL}>
              - International -
            </option>
          </select>
        </FormGroup>
        {data[type].countryType === constants.COUNTRY_TYPES.INTERNATIONAL && (
          <FormGroup errorText={validationErrors?.[type]?.country}>
            <label className="usa-label" htmlFor={`${type}.country`}>
              Country name
            </label>
            <input
              autoCapitalize="none"
              className={`${type}-country usa-input`}
              id={`${type}.country`}
              name={`${type}.country`}
              type="text"
              value={data[type].country || ''}
              onBlur={() => {
                if (validateStartCaseSequence) {
                  validateStartCaseSequence();
                }
              }}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        )}
      </React.Fragment>
    );
  },
);
