import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const Country = connect(
  {
    constants: state.constants,
    contactFormType: props.type,
    form: state.form,
    // eslint-disable-next-line spellcheck/spell-checker
    onChangeCountryType: sequences[props.onChangeCountryType],
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateStartCaseSequence: sequences[props.onBlur],
    validationErrors: state.validationErrors,
  },
  function Country({
    constants,
    contactFormType,
    form,
    onChangeCountryType,
    updateFormValueSequence,
    validateStartCaseSequence,
    validationErrors,
  }) {
    return (
      <>
        <FormGroup errorText={validationErrors?.[contactFormType]?.countryType}>
          <legend className="usa-label">Country</legend>
          <div className="usa-radio usa-radio__inline">
            <input
              checked={
                form[contactFormType].countryType ===
                constants.COUNTRY_TYPES.DOMESTIC
              }
              className="usa-radio__input"
              id={`${contactFormType}-countryType-domestic`}
              name={`${contactFormType}.countryType`}
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
              htmlFor={`${contactFormType}-countryType-domestic`}
              id="country-radio-label-international"
            >
              United States
            </label>
            <input
              checked={
                form[contactFormType].countryType ===
                constants.COUNTRY_TYPES.INTERNATIONAL
              }
              className="usa-radio__input"
              id={`${contactFormType}-countryType-international`}
              name={`${contactFormType}.countryType`}
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
              htmlFor={`${contactFormType}-countryType-international`}
              id="country-radio-label-international"
            >
              International
            </label>
          </div>
        </FormGroup>
        {form[contactFormType].countryType ===
          constants.COUNTRY_TYPES.INTERNATIONAL && (
          <FormGroup errorText={validationErrors?.[contactFormType]?.country}>
            <label
              className="usa-label"
              htmlFor={`${contactFormType}intl-country-input`}
            >
              Country name
            </label>
            <input
              className={`${contactFormType}-country usa-input`}
              id={`${contactFormType}-intl-country-input`}
              name={`${contactFormType}.intlCountryName`}
              type="text"
              value={form[contactFormType].intlCountryName || ''}
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
