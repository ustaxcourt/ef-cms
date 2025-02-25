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
    onBlur: props.onBlur,
    onChangeCountryType: sequences[props.onChangeCountryType],
    registerRef: props.registerRef,
    type: props.type,
    updateFormValueSequence: sequences[props.onChange],
    validationErrors: state.validationErrors,
  },
  function Country({
    constants,
    data,
    onBlur,
    onChangeCountryType,
    registerRef,
    type,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <React.Fragment>
        <FormGroup errorText={validationErrors?.[type]?.countryType}>
          <label className="usa-label" htmlFor={`${type}.countryType`}>
            Country
          </label>
          <div className="usa-radio usa-radio__inline">
            <input
              checked={
                data[type].countryType === constants.COUNTRY_TYPES.DOMESTIC
              }
              className="usa-radio__input"
              id={`${type}-countryType-domestic`}
              name={`${type}.countryType`}
              ref={registerRef && registerRef(`${type}.countryType`)}
              type="radio"
              value={constants.COUNTRY_TYPES.DOMESTIC}
              onChange={e => {
                const method = onChangeCountryType || updateFormValueSequence;
                method({
                  key: e.target.name,
                  type,
                  value: e.target.value,
                });
                if (onBlur) {
                  onBlur({
                    validationKey: [type, 'countryType'],
                  });
                }
              }}
            />
            <label
              className="usa-radio__label"
              data-testid="domestic-country-btn"
              htmlFor={`${type}-countryType-domestic`}
              id={`${type}-country-radio-label-domestic`}
            >
              United States
            </label>
            <input
              checked={
                data[type].countryType === constants.COUNTRY_TYPES.INTERNATIONAL
              }
              className="usa-radio__input"
              id={`${type}-countryType-international`}
              name={`${type}.countryType`}
              type="radio"
              value={constants.COUNTRY_TYPES.INTERNATIONAL}
              onChange={e => {
                const method = onChangeCountryType || updateFormValueSequence;
                method({
                  key: e.target.name,
                  type,
                  value: e.target.value,
                });
                if (onBlur) {
                  onBlur({
                    validationKey: [type, 'countryType'],
                  });
                }
              }}
            />
            <label
              className="usa-radio__label"
              data-testid="international-country-btn"
              htmlFor={`${type}-countryType-international`}
              id={`${type}-country-radio-label-international`}
            >
              International
            </label>
          </div>
        </FormGroup>
        {data[type].countryType === constants.COUNTRY_TYPES.INTERNATIONAL && (
          <FormGroup
            errorMessageId="country-error-message"
            errorText={validationErrors?.[type]?.country}
          >
            <label className="usa-label" htmlFor={`${type}.country`}>
              Country name
            </label>
            <input
              autoCapitalize="none"
              className={`${type}-country usa-input`}
              data-testid="international-country-input"
              id={`${type}.country`}
              name={`${type}.country`}
              ref={registerRef && registerRef(`${type}.country`)}
              type="text"
              value={data[type].country || ''}
              onBlur={() => {
                if (onBlur) {
                  onBlur({
                    validationKey: [type, 'country'],
                  });
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

Country.displayName = 'Country';
