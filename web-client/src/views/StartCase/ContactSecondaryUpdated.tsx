import { Address } from './Address';
import { Country } from './Country';
import { ElectronicServiceConsentCheckbox } from '@web-client/views/StartCaseInternal/ElectronicServiceCheckbox';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './InternationalAddress';
import { PlaceOfLegalResidenceDropdown } from '@web-client/views/StartCase/PlaceOfLegalResidenceDropdown';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { props as cerebralProps } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  bind: string;
  onBlur: string;
  onChange: string;
  nameLabel: string;
  registerRef?: Function;
  displayInCareOf?: boolean;
  showSameAsPrimaryCheckbox?: boolean;
  onChangeCountryType: string;
};

export const ContactSecondaryUpdated = connect(
  {
    bind: props.bind,
    constants: state.constants,
    data: state[props.bind],
    displayInCareOf: props.displayInCareOf,
    nameLabel: props.nameLabel,
    onBlur: props.onBlur,
    onBlurSequence: sequences[props.onBlur],
    onChange: props.onChange,
    onChangeCountryType: props.onChangeCountryType,
    onChangeSequence: sequences[props.onChange],
    registerRef: props.registerRef,
    resetSecondaryAddressSequence: sequences.resetSecondaryAddressSequence,
    showSameAsPrimaryCheckbox: props.showSameAsPrimaryCheckbox,
    validationErrors: state.validationErrors,
  },
  function ContactSecondaryUpdated({
    bind,
    constants,
    data,
    displayInCareOf,
    nameLabel,
    onBlur,
    onBlurSequence,
    onChange,
    onChangeCountryType,
    onChangeSequence,
    registerRef,
    resetSecondaryAddressSequence,
    showSameAsPrimaryCheckbox,
    validationErrors = {} as {
      contactSecondary?: {
        secondaryName: string;
        inCareOf: string;
        name: string;
        phone: string;
      };
    },
  }) {
    return (
      <>
        <div>
          <FormGroup
            errorMessageId="secondary-contact-name-error-message"
            errorText={
              validationErrors.contactSecondary &&
              validationErrors.contactSecondary.name
            }
          >
            <label className="usa-label" htmlFor="name">
              {nameLabel}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              data-testid="contact-secondary-name"
              id="name"
              name="contactSecondary.name"
              ref={registerRef && registerRef('contactSecondary.name')}
              type="text"
              value={data.contactSecondary.name || ''}
              onBlur={() => {
                onBlurSequence({
                  validationKey: ['contactSecondary', 'name'],
                });
              }}
              onChange={e => {
                onChangeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
          {displayInCareOf && (
            <InCareOf
              inCareOf={data.contactSecondary.inCareOf}
              registerRef={registerRef}
              type="contactSecondary"
              validationErrors={validationErrors}
              onBlurSequence={onBlurSequence}
              onChangeSequence={onChangeSequence}
            />
          )}
          {showSameAsPrimaryCheckbox && (
            <SameAddressCheckbox
              resetSecondaryAddressSequence={resetSecondaryAddressSequence}
              useSameAsPrimary={data.useSameAsPrimary}
            />
          )}
          {!data.useSameAsPrimary && (
            <>
              <Country
                bind={bind}
                registerRef={registerRef}
                type="contactSecondary"
                onBlur={onBlurSequence}
                onChange={onChange}
                onChangeCountryType={onChangeCountryType}
              />
              {data.contactSecondary.countryType ===
                constants.COUNTRY_TYPES.DOMESTIC && (
                <Address
                  bind={bind}
                  registerRef={registerRef}
                  type="contactSecondary"
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
              {data.contactSecondary.countryType ===
                constants.COUNTRY_TYPES.INTERNATIONAL && (
                <InternationalAddress
                  bind={bind}
                  registerRef={registerRef}
                  type="contactSecondary"
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
              <PlaceOfLegalResidenceDropdown
                bind={bind}
                registerRef={registerRef}
                type="contactSecondary"
                onBlurSequence={() => {
                  onBlurSequence({
                    validationKey: [
                      'contactSecondary',
                      'placeOfLegalResidence',
                    ],
                  });
                }}
                onChange={onChange}
              />
            </>
          )}
          <FormGroup
            className="phone-input"
            errorText={
              validationErrors.contactSecondary &&
              validationErrors.contactSecondary.phone
            }
          >
            <label className="usa-label" htmlFor="secondary-phone">
              Phone number <span className="usa-hint">(Optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input max-width-200"
              data-testid="contact-secondary-phone"
              id="secondary-phone"
              name="contactSecondary.phone"
              ref={registerRef && registerRef('contactSecondary.phone')}
              type="tel"
              value={data.contactSecondary.phone || ''}
              onBlur={() => {
                onBlurSequence({
                  validationKey: ['contactSecondary', 'phone'],
                });
              }}
              onChange={e => {
                onChangeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
          <FormGroup
            errorMessageId="email-error-message"
            errorText={
              validationErrors.contactSecondary &&
              validationErrors.contactSecondary.email
            }
          >
            <label className="usa-label" htmlFor="email">
              Email address <span className="usa-hint">(Optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              data-testid="contact-secondary-email"
              id="email"
              name="contactSecondary.email"
              ref={registerRef && registerRef('contactSecondary.email')}
              type="text"
              value={data.contactSecondary.email || ''}
              onBlur={() => {
                onBlurSequence({
                  validationKey: ['contactSecondary', 'email'],
                });
              }}
              onChange={e => {
                onChangeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
          <ElectronicServiceConsentCheckbox
            bind="form"
            contactType="contactSecondary"
          />
          {data.contactSecondary.hasConsentedToEService && (
            <WarningNotificationComponent
              alertWarning={{
                message:
                  'No paper service will be made to the mailing address after the Court verifies the email address.',
              }}
              dismissible={false}
              scrollToTop={false}
            />
          )}
        </div>
      </>
    );
  },
);

function SameAddressCheckbox({
  resetSecondaryAddressSequence,
  useSameAsPrimary,
}) {
  return (
    <FormGroup>
      <input
        checked={useSameAsPrimary}
        className="usa-checkbox__input"
        id="use-same-address-above"
        name="useSameAsPrimary"
        type="checkbox"
        onChange={e => {
          resetSecondaryAddressSequence({
            key: e.target.name,
            value: e.target.checked,
          });
        }}
      />
      <label
        className="usa-checkbox__label"
        data-testid="use-same-address-above-label"
        htmlFor="use-same-address-above"
        id="use-same-address-above-label"
      >
        Use same mailing address as above
      </label>
    </FormGroup>
  );
}

export function InCareOf({
  inCareOf,
  isOptional = false,
  onBlurSequence,
  onChangeSequence,
  registerRef,
  type,
  validationErrors,
}) {
  return (
    <FormGroup
      errorMessageId={`in-care-of-${type}-error-message`}
      errorText={validationErrors[type] && validationErrors[type].inCareOf}
    >
      <label className="usa-label" htmlFor="inCareOf">
        <span>In care of</span>
        {isOptional && (
          <>
            {' '}
            <span className="usa-hint">(optional)</span>
          </>
        )}
      </label>
      <input
        autoCapitalize="none"
        className="usa-input"
        data-testid={`${type}-in-care-of`}
        id="inCareOf"
        name={`${type}.inCareOf`}
        ref={registerRef && registerRef(`${type}.inCareOf`)}
        type="text"
        value={inCareOf || ''}
        onBlur={() => {
          onBlurSequence({
            validationKey: [type, 'inCareOf'],
          });
        }}
        onChange={e => {
          onChangeSequence({
            key: e.target.name,
            value: e.target.value,
          });
        }}
      />
    </FormGroup>
  );
}

ContactSecondaryUpdated.displayName = 'ContactSecondaryUpdated';
