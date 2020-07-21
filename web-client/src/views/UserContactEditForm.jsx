import { Address } from './StartCase/Address';
import { Country } from './StartCase/Country';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const UserContactEditForm = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    bind: props.bind,
    changeCountryTypeSequence: props.changeCountryTypeSequence,
    form: state.form,
    onBlurSequenceName: props.onBlurSequenceName,
    onBlurValidationSequence: sequences[props.onBlurSequenceName],
    onChangeSequenceName: props.onChangeSequenceName,
    onChangeUpdateSequence: sequences[props.onChangeSequenceName],
    type: props.type,
    validationErrors: state.validationErrors,
  },
  function UserContactEditForm({
    bind,
    changeCountryTypeSequence,
    COUNTRY_TYPES,
    form,
    onBlurSequenceName,
    onBlurValidationSequence,
    onChangeSequenceName,
    onChangeUpdateSequence,
    type,
    validationErrors,
  }) {
    return (
      <>
        <Country
          bind={bind}
          type={type}
          onBlur={onBlurSequenceName}
          onChange={onChangeSequenceName}
          onChangeCountryType={changeCountryTypeSequence}
        />
        {form.contact.countryType === COUNTRY_TYPES.DOMESTIC ? (
          <Address
            bind={bind}
            type={type}
            onBlur={onBlurSequenceName}
            onChange={onChangeSequenceName}
          />
        ) : (
          <InternationalAddress
            bind={bind}
            type={type}
            onBlur={onBlurSequenceName}
            onChange={onChangeSequenceName}
          />
        )}
        <FormGroup
          errorText={
            validationErrors &&
            validationErrors.contact &&
            validationErrors.contact.phone
          }
        >
          <label className="usa-label" htmlFor="phone">
            Phone number
          </label>
          <input
            autoCapitalize="none"
            className="usa-input max-width-200"
            id="phone"
            name="contact.phone"
            type="tel"
            value={form.contact.phone || ''}
            onBlur={() => {
              onBlurValidationSequence();
            }}
            onChange={e => {
              onChangeUpdateSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
      </>
    );
  },
);
