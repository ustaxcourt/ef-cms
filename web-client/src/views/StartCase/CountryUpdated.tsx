import {
  AddressType,
  OnBlurHandler,
  OnChangeCountryTypeHandler,
} from '@web-client/views/StartCase/AddressUpdated';
import { COUNTRY_TYPES } from '@shared/business/entities/EntityConstants';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type CountryTypes = {
  addressInfo: AddressType;
  handleBlur: OnBlurHandler;
  handleChange: OnChangeCountryTypeHandler;
  registerRef?: Function;
  type: string;
};

const countryDeps = {
  validationErrors: state.validationErrors,
};

export const CountryUpdated = connect<CountryTypes, typeof countryDeps>(
  countryDeps,
  function Country({
    addressInfo,
    handleBlur,
    handleChange,
    registerRef,
    type,
    validationErrors,
  }) {
    return (
      <>
        <FormGroup errorText={validationErrors?.[type]?.countryType}>
          <label className="usa-label" htmlFor={`${type}.countryType`}>
            Country
          </label>
          <div className="usa-radio usa-radio__inline">
            <input
              checked={addressInfo.countryType === COUNTRY_TYPES.DOMESTIC}
              className="usa-radio__input"
              id={`${type}-countryType-domestic`}
              name={`${type}.countryType`}
              ref={registerRef && registerRef(`${type}.countryType`)}
              type="radio"
              value={COUNTRY_TYPES.DOMESTIC}
              onChange={e => {
                handleChange({
                  key: e.target.name,
                  type,
                  value: e.target.value,
                });
                if (handleBlur) {
                  handleBlur({ validationKey: [type, 'countryType'] });
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
              checked={addressInfo.countryType === COUNTRY_TYPES.INTERNATIONAL}
              className="usa-radio__input"
              id={`${type}-countryType-international`}
              name={`${type}.countryType`}
              type="radio"
              value={COUNTRY_TYPES.INTERNATIONAL}
              onChange={e => {
                handleChange({
                  key: e.target.name,
                  type,
                  value: e.target.value,
                });
                if (handleBlur) {
                  handleBlur({
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
      </>
    );
  },
);

CountryUpdated.displayName = 'CountryUpdated';
