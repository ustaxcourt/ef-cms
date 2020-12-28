import { Address } from '../StartCase/Address';
import { Button } from '../../ustc-ui/Button/Button';
import { Country } from '../StartCase/Country';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from '../StartCase/InternationalAddress';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const PractitionerContactForm = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    bind: props.bind,
    changeCountryTypeSequence: props.changeCountryTypeSequence,
    createPractitionerUserHelper: state.createPractitionerUserHelper,
    form: state.form,
    onBlurSequenceName: props.onBlurSequenceName,
    onBlurValidationSequence: sequences[props.onBlurSequenceName],
    onChangeSequenceName: props.onChangeSequenceName,
    onChangeUpdateSequence: sequences[props.onChangeSequenceName],
    screenMetadata: state.screenMetadata,
    showPractitionerEmailInputSequence:
      sequences.showPractitionerEmailInputSequence,
    type: props.type,
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
    screenMetadata,
    showPractitionerEmailInputSequence,
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

        <div className="grid-row">
          <div className="grid-col-6">
            {createPractitionerUserHelper.canEditEmail ? (
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
            ) : (
              <FormGroup errorText={validationErrors.email}>
                <span className="usa-label">
                  Email address{' '}
                  {!screenMetadata.showPractitionerEmailInput && !form.email && (
                    <Button
                      link
                      className="margin-left-2"
                      icon="plus-circle"
                      id="add-practitioner-email-button"
                      onClick={() => {
                        showPractitionerEmailInputSequence();
                      }}
                    >
                      Add email address
                    </Button>
                  )}
                </span>
                {screenMetadata.showPractitionerEmailInput ? (
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
                ) : (
                  <p>{createPractitionerUserHelper.emailFormatted}</p>
                )}
              </FormGroup>
            )}
          </div>

          <div className="grid-col-6">
            <FormGroup>
              <label className="usa-label" htmlFor="alternateEmail">
                Alternative email address{' '}
                <span className="usa-hint">(optional)</span>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="alternateEmail"
                name="alternateEmail"
                value={form.alternateEmail || ''}
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
