import { Address } from './StartCase/Address';
import { Country } from './StartCase/Country';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const PractitionerContactEditForm = connect(
  {
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
  function PractitionerContactEditForm({
    bind,
    changeCountryTypeSequence,
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
        {form.contact.countryType === 'domestic' ? (
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
            <FormGroup
              errorText={
                validationErrors &&
                validationErrors.contact &&
                validationErrors.contact.additionalPhone
              }
            >
              <label className="usa-label" htmlFor="additionalPhone">
                Additional phone number{' '}
                <span className="usa-hint">(optional)</span>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="phone"
                name="contact.additionalPhone"
                type="tel"
                value={form.contact.additionalPhone || ''}
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
        </div>

        <div className="grid-row">
          <div className="grid-col-6">
            <FormGroup
              errorText={
                validationErrors &&
                validationErrors.contact &&
                validationErrors.contact.email
              }
            >
              <label className="usa-label" htmlFor="email">
                Email address
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="email"
                name="contact.email"
                value={form.contact.email || ''}
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
            <FormGroup
              errorText={
                validationErrors &&
                validationErrors.contact &&
                validationErrors.contact.alternateEmail
              }
            >
              <label className="usa-label" htmlFor="alternateEmail">
                Alternative email address{' '}
                <span className="usa-hint">(optional)</span>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="alternateEmail"
                name="contact.alternateEmail"
                value={form.contact.alternateEmail || ''}
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
        </div>
      </>
    );
  },
);
