import { Address } from '../StartCase/Address';
import { Country } from '../StartCase/Country';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from '../StartCase/InternationalAddress';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const PractitionerContactForm = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    createPractitionerUserHelper: state.createPractitionerUserHelper,
    form: state.form,
    onBlurValidationSequence: sequences[props.onBlurSequenceName],
    onChangeUpdateSequence: sequences[props.onChangeSequenceName],
    validationErrors: state.validationErrors,
  },
  function PractitionerContactForm({
    bind,
    changeCountryTypeSequence,
    COUNTRY_TYPES,
    createPractitionerUserHelper,
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
        <div className="grid-row">
          <div className="grid-col-6">
            <FormGroup errorText={validationErrors.phone}>
              <label className="usa-label" htmlFor="phone">
                Phone number
              </label>
              <span className="usa-hint">
                If you do not have a current phone number, enter N/A.
              </span>
              <input
                autoCapitalize="none"
                className="usa-input"
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
          </div>

          <div className="grid-col-6">
            <FormGroup>
              <label className="usa-label" htmlFor="additional-phone">
                Additional phone number{' '}
                <span className="usa-hint">(optional)</span>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="additional-phone"
                name="additionalPhone"
                type="tel"
                value={form.additionalPhone || ''}
                onChange={e => {
                  onChangeUpdateSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>
        </div>
        {createPractitionerUserHelper.isAddingPractitioner && (
          <FormGroup errorText={validationErrors.email}>
            <label className="usa-label" htmlFor="email">
              Email address
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id="email"
              name="email"
              value={form.email || ''}
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
        )}
      </>
    );
  },
);
