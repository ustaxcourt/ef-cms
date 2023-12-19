import { Address } from './Address';
import { Country } from './Country';
import { EConsent } from '../StartCaseInternal/EConsent';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './InternationalAddress';
import { PaperPetitionEmail } from '../StartCaseInternal/PaperPetitionEmail';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ContactSecondary = connect(
  {
    bind: props.bind,
    constants: state.constants,
    contactsHelper: state[props.contactsHelper],
    data: state[props.bind],
    onBlur: props.onBlur,
    onBlurSequence: sequences[props.onBlur],
    onChange: props.onChange,
    onChangeSequence: sequences[props.onChange],
    parentView: props.parentView,
    toggleUseContactPrimaryAddressSequence:
      sequences.toggleUseContactPrimaryAddressSequence,
    updateFormValueAndSecondaryContactInfoSequence:
      sequences.updateFormValueAndSecondaryContactInfoSequence,
    validationErrors: state.validationErrors,
  },
  function ContactSecondary({
    bind,
    constants,
    contactsHelper,
    data,
    onBlur,
    onBlurSequence,
    onChange,
    onChangeSequence,
    parentView,
    toggleUseContactPrimaryAddressSequence,
    updateFormValueAndSecondaryContactInfoSequence,
    useSameAsPrimary,
    validationErrors,
    wrapperClassName,
  }) {
    return (
      <>
        {parentView === 'StartCase' ? (
          <h3 className="margin-top-4">
            {contactsHelper.contactSecondary.header}
          </h3>
        ) : (
          <h4>{contactsHelper.contactSecondary.header}</h4>
        )}
        <div className={wrapperClassName || 'blue-container contact-group'}>
          <FormGroup
            errorText={
              validationErrors.contactSecondary &&
              validationErrors.contactSecondary.name
            }
          >
            <label className="usa-label" htmlFor="secondaryName">
              {contactsHelper.contactSecondary.nameLabel}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              data-testid="contact-secondary-name"
              id="secondaryName"
              name="contactSecondary.name"
              type="text"
              value={data.contactSecondary.name || ''}
              onBlur={() => {
                onBlurSequence();
              }}
              onChange={e => {
                onChangeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
          {useSameAsPrimary && (
            <FormGroup>
              <input
                checked={data.useSameAsPrimary || false}
                className="usa-checkbox__input"
                id="use-same-address-above"
                name="useSameAsPrimary"
                type="checkbox"
                onChange={e => {
                  updateFormValueAndSecondaryContactInfoSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  toggleUseContactPrimaryAddressSequence();
                }}
              />
              <label
                className="usa-checkbox__label"
                data-testid="use-same-address-above-label"
                htmlFor="use-same-address-above"
                id="use-same-address-above-label"
              >
                Use same address &amp; phone number as above
              </label>
            </FormGroup>
          )}
          {contactsHelper.contactSecondary.displayInCareOf && (
            <FormGroup
              errorText={
                validationErrors.contactSecondary &&
                validationErrors.contactSecondary.inCareOf
              }
            >
              <label className="usa-label" htmlFor="secondaryInCareOf">
                {contactsHelper.contactSecondary.inCareOfLabel ? (
                  <span>
                    {contactsHelper.contactSecondary.inCareOfLabel}{' '}
                    {contactsHelper.contactSecondary.inCareOfLabelHint && (
                      <span className="usa-hint">
                        ({contactsHelper.contactSecondary.inCareOfLabelHint})
                      </span>
                    )}
                  </span>
                ) : (
                  <span>
                    In care of <span className="usa-hint">(optional)</span>
                  </span>
                )}
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                data-testid="contact-secondary-care-of-name"
                id="secondaryInCareOf"
                name="contactSecondary.inCareOf"
                type="text"
                value={data.contactSecondary.inCareOf || ''}
                onBlur={() => {
                  onBlurSequence();
                }}
                onChange={e => {
                  onChangeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          )}
          <Country
            bind={bind}
            type="contactSecondary"
            onBlur={onBlur}
            onChange={onChange}
          />
          {data.contactSecondary.countryType ===
            constants.COUNTRY_TYPES.DOMESTIC && (
            <Address
              bind={bind}
              type="contactSecondary"
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          {data.contactSecondary.countryType ===
            constants.COUNTRY_TYPES.INTERNATIONAL && (
            <InternationalAddress
              bind={bind}
              type="contactSecondary"
              onBlur={onBlur}
              onChange={onChange}
            />
          )}

          {contactsHelper.showPaperPetitionEmailFieldAndConsentBox && (
            <>
              <PaperPetitionEmail bind={bind} contactType="contactSecondary" />
              <EConsent bind={bind} contactType="contactSecondary" />
            </>
          )}

          {contactsHelper.contactSecondary.displayPhone && (
            <FormGroup
              errorText={
                validationErrors.contactSecondary &&
                validationErrors.contactSecondary.phone
              }
            >
              <label className="usa-label" htmlFor="secondaryPhone">
                Phone number
              </label>
              <span className="usa-hint">
                If you do not have a current phone number, enter N/A.
              </span>
              <input
                autoCapitalize="none"
                className="usa-input max-width-200"
                id="secondaryPhone"
                name="contactSecondary.phone"
                type="tel"
                value={data.contactSecondary.phone || ''}
                onBlur={() => {
                  onBlurSequence();
                }}
                onChange={e => {
                  onChangeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          )}
        </div>
      </>
    );
  },
);

ContactSecondary.displayName = 'ContactSecondary';
