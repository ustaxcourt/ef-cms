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
  displayInCareOf?: boolean;
  showSameAsPrimaryCheckbox?: boolean;
  showPlaceOfLegalResidence?: boolean;
};

export const ContactSecondaryUpdated = connect(
  {
    bind: props.bind,
    constants: state.constants,
    data: state[props.bind],
    displayInCareOf: props.displayInCareOf,
    nameLabel: props.nameLabel,
    //   onBlur: props.onBlur,
    //   onBlurSequence: sequences[props.onBlur],
    onChange: props.onChange,

    onChangeSequence: sequences[props.onChange],
    resetSecondaryAddressSequence: sequences.resetSecondaryAddressSequence,
    showPlaceOfLegalResidence: props.showPlaceOfLegalResidence,
    showSameAsPrimaryCheckbox: props.showSameAsPrimaryCheckbox,
    validationErrors: state.validationErrors,
  },
  function ContactSecondaryUpdated({
    bind,
    constants,
    data,
    displayInCareOf,
    nameLabel,
    // onBlurSequence,
    onChange,
    onChangeSequence,
    resetSecondaryAddressSequence,
    showPlaceOfLegalResidence,
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
              data-testid="contact-primary-name"
              id="name"
              name="contactSecondary.name"
              type="text"
              value={data.contactSecondary.name || ''}
              onBlur={() => {
                // onBlurSequence();
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
              validationErrors={validationErrors}
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
                type="contactSecondary"
                // onBlur={onBlur}
                onChange={onChangeSequence}
              />
              {data.contactSecondary.countryType ===
                constants.COUNTRY_TYPES.DOMESTIC && (
                <Address
                  bind={bind}
                  type="contactSecondary"
                  // onBlur={onBlur}
                  onChange={onChange}
                />
              )}
              {data.contactSecondary.countryType ===
                constants.COUNTRY_TYPES.INTERNATIONAL && (
                <InternationalAddress
                  bind={bind}
                  type="contactSecondary"
                  // onBlur={onBlur}
                  onChange={onChange}
                />
              )}
              {showPlaceOfLegalResidence && (
                <PlaceOfLegalResidenceDropdown
                  bind={bind}
                  type="contactSecondary"
                  onChange={onChange}
                />
              )}
            </>
          )}
          <FormGroup
            className="phone-input"
            errorText={
              validationErrors.contactSecondary &&
              validationErrors.contactSecondary.phone
            }
          >
            <label className="usa-label" htmlFor="phone">
              Phone number <span className="usa-hint">(Optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input max-width-200"
              data-testid="phone"
              id="phone"
              name="contactSecondary.phone"
              type="tel"
              value={data.contactSecondary.phone || ''}
              // onBlur={() => {
              //   onBlurSequence();
              // }}
              onChange={e => {
                onChangeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
          <FormGroup
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
              id="email"
              name="contactSecondary.email"
              type="text"
              value={data.contactSecondary.email || ''}
              // onBlur={() => {
              //   onBlurSequence();
              // }}
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

function InCareOf({ inCareOf, onChangeSequence, validationErrors }) {
  return (
    <FormGroup
      errorText={
        validationErrors.contactSecondary &&
        validationErrors.contactSecondary.inCareOf
      }
    >
      <label className="usa-label" htmlFor="inCareOf">
        <span>In care of</span>
      </label>
      <input
        autoCapitalize="none"
        className="usa-input"
        id="inCareOf"
        name="contactSecondary.inCareOf"
        type="text"
        value={inCareOf || ''}
        onBlur={() => {
          // onBlurSequence();
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
