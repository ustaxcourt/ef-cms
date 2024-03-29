import { Address } from './StartCase/Address';
import { Country } from './StartCase/Country';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UserContactEditForm = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateUserContactSequence: sequences.validateUserContactSequence,
    validationErrors: state.validationErrors,
  },
  function UserContactEditForm({
    COUNTRY_TYPES,
    form,
    updateFormValueSequence,
    validateUserContactSequence,
    validationErrors,
  }) {
    const bind = 'form';
    const type = 'contact';

    return (
      <>
        <Country
          type={type}
          onBlur={validateUserContactSequence}
          onChange={updateFormValueSequence}
        />
        {form.contact.countryType === COUNTRY_TYPES.DOMESTIC ? (
          <Address
            bind={bind}
            type={type}
            onBlur={'validateUserContactSequence'}
            onChange={'updateFormValueSequence'}
          />
        ) : (
          <InternationalAddress
            bind={bind}
            type={type}
            onBlur={'validateUserContactSequence'}
            onChange={'updateFormValueSequence'}
          />
        )}
        <FormGroup errorText={validationErrors?.contact?.phone}>
          <label className="usa-label" htmlFor="phone">
            Phone number
          </label>
          <span className="usa-hint">
            If you do not have a current phone number, enter N/A.
          </span>
          <input
            autoCapitalize="none"
            className="usa-input max-width-200"
            data-testid="phone-number-input"
            id="phone"
            name="contact.phone"
            type="tel"
            value={form.contact.phone || ''}
            onBlur={() => {
              validateUserContactSequence();
            }}
            onChange={e => {
              updateFormValueSequence({
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

UserContactEditForm.displayName = 'UserContactEditForm';
