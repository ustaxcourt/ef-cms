import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
      <>
        <FormGroup errorText={validationErrors?.[type]?.countryType}>
          <legend className="usa-label">Country</legend>
          <div className="usa-radio usa-radio__inline">
            <input
              checked={
                data[type].countryType === constants.COUNTRY_TYPES.DOMESTIC
              }
              className="usa-radio__input"
              id={`${type}.countryType`}
              name={`${type}.countryType`}
              type="radio"
              value={constants.COUNTRY_TYPES.DOMESTIC}
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
            />
            <label
              className="usa-radio__label"
              data-testid="international-country-btn"
              htmlFor={`${type}.countryType`}
              id="country-radio-label-international"
            >
              United States
            </label>
            <input
              checked={
                data[type].countryType === constants.COUNTRY_TYPES.INTERNATIONAL
              }
              className="usa-radio__input"
              id={`${type}.countryType`}
              name={`${type}.countryType`}
              type="radio"
              value={constants.COUNTRY_TYPES.INTERNATIONAL}
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
            />
            <label
              className="usa-radio__label"
              data-testid="international-country-btn"
              htmlFor={`${type}.countryType`}
              id="country-radio-label-international"
            >
              International
            </label>
          </div>
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
      </>
    );
  },
);

Country.displayName = 'Country';
