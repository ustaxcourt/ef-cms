import { Address } from './StartCase/Address';
import { Country } from './StartCase/Country';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';

export const UserContactEditForm = connect(
  {
    bind: props.bind,
    form: state.form,
    onBlur: props.onBlurSequence,
    type: props.type,
    updateSequence: props.updateSequence,
    validateSequence: props.validateSequence,
    validationErrors: state.validationErrors,
  },
  ({
    bind,
    form,
    onBlur,
    type,
    updateSequence,
    validateSequence,
    validationErrors,
  }) => {
    return (
      <>
        <Country
          bind={bind}
          type={type}
          onBlur={onBlur}
          onChange="updateSequence"
          onChangeCountryType="countryTypeUserContactChangeSequence"
        />
        {form.contact.countryType === 'domestic' ? (
          <Address
            bind={bind}
            type={type}
            onBlur={onBlur}
            onChange="updateSequence"
          />
        ) : (
          <InternationalAddress
            bind={bind}
            type={type}
            onBlur={onBlur}
            onChange="updateSequence"
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
              validateSequence();
            }}
            onChange={e => {
              updateSequence({
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
