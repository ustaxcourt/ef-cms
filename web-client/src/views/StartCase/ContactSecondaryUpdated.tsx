import {
  AddressType,
  AddressUpdated,
  OnBlurHandler,
  OnChangeCountryTypeHandler,
  OnChangeHandler,
} from '@web-client/views/StartCase/AddressUpdated';
import { CountryUpdated } from '@web-client/views/StartCase/CountryUpdated';
import { ElectronicServiceConsentCheckbox } from '@web-client/views/StartCaseInternal/ElectronicServiceCheckbox';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InternationalAddressUpdated } from '@web-client/views/StartCase/InternationalAddressUpdated';
import { PlaceOfLegalResidenceDropdown } from '@web-client/views/StartCase/PlaceOfLegalResidenceDropdown';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type ContactSecondary = {
  addressInfo: AddressType;
  displayInCareOf?: boolean;
  nameLabel: string;
  handleBlur: OnBlurHandler;
  handleChange: OnChangeHandler;
  handleChangeCountryType: OnChangeCountryTypeHandler;
  registerRef?: Function;
  showElectronicServiceConsent?: boolean;
  showSameAsPrimaryCheckbox: boolean;
  useSameAsPrimary: boolean;
};

const contactSecondaryDeps = {
  constants: state.constants,
  resetSecondaryAddressSequence: sequences.resetSecondaryAddressSequence,
  validationErrors: state.validationErrors,
};

export const ContactSecondaryUpdated = connect<
  ContactSecondary,
  typeof contactSecondaryDeps
>(
  contactSecondaryDeps,
  function ContactSecondaryUpdated({
    addressInfo,
    constants,
    displayInCareOf,
    handleBlur,
    handleChange,
    handleChangeCountryType,
    nameLabel,
    registerRef,
    resetSecondaryAddressSequence,
    showElectronicServiceConsent = true,
    showSameAsPrimaryCheckbox,
    useSameAsPrimary,
    validationErrors = {} as {
      contactSecondary?: {
        secondaryName: string;
        inCareOf: string;
        name: string;
        phone: string;
        paperPetitionEmail: string;
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
              value={addressInfo.name || ''}
              onBlur={() => {
                handleBlur({
                  validationKey: ['contactSecondary', 'name'],
                });
              }}
              onChange={e => {
                handleChange({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
          {displayInCareOf && (
            <InCareOf
              handleBlur={handleBlur}
              handleChange={handleChange}
              inCareOf={addressInfo.inCareOf}
              registerRef={registerRef}
              type="contactSecondary"
              validationErrors={validationErrors}
            />
          )}
          {showSameAsPrimaryCheckbox && (
            <SameAddressCheckbox
              resetSecondaryAddressSequence={resetSecondaryAddressSequence}
              useSameAsPrimary={useSameAsPrimary}
            />
          )}
          {!useSameAsPrimary && (
            <>
              <CountryUpdated
                addressInfo={addressInfo}
                handleBlur={handleBlur}
                handleChange={handleChangeCountryType}
                registerRef={registerRef}
                type="contactSecondary"
              />
              {addressInfo.countryType === constants.COUNTRY_TYPES.DOMESTIC && (
                <AddressUpdated
                  addressInfo={addressInfo}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  registerRef={registerRef}
                  type="contactSecondary"
                />
              )}
              {addressInfo.countryType ===
                constants.COUNTRY_TYPES.INTERNATIONAL && (
                <InternationalAddressUpdated
                  addressInfo={addressInfo}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  registerRef={registerRef}
                  type="contactSecondary"
                />
              )}
            </>
          )}
          <PlaceOfLegalResidenceDropdown
            addressInfo={addressInfo}
            handleBlur={() => {
              handleBlur({
                validationKey: ['contactSecondary', 'placeOfLegalResidence'],
              });
            }}
            handleChange={handleChange}
            registerRef={registerRef}
            type="contactSecondary"
          />
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
              type="text"
              value={addressInfo.phone || ''}
              onBlur={() => {
                handleBlur({
                  validationKey: ['contactSecondary', 'phone'],
                });
              }}
              onChange={e => {
                handleChange({
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
              validationErrors.contactSecondary.paperPetitionEmail
            }
          >
            <label className="usa-label" htmlFor="paperPetitionEmail">
              Email address <span className="usa-hint">(Optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              data-testid="contact-secondary-email"
              id="paperPetitionEmail"
              name="contactSecondary.paperPetitionEmail"
              ref={
                registerRef &&
                registerRef('contactSecondary.paperPetitionEmail')
              }
              type="text"
              value={addressInfo.paperPetitionEmail || ''}
              onBlur={() => {
                handleBlur({
                  validationKey: ['contactSecondary', 'paperPetitionEmail'],
                });
              }}
              onChange={e => {
                handleChange({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
          {showElectronicServiceConsent && (
            <>
              <ElectronicServiceConsentCheckbox
                bind="form"
                contactType="contactSecondary"
              />
              {addressInfo.hasConsentedToEService && (
                <WarningNotificationComponent
                  alertWarning={{
                    message:
                      'No paper service will be made to the mailing address after the Court verifies the email address.',
                  }}
                  dismissible={false}
                  scrollToTop={false}
                />
              )}
            </>
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
    <FormGroup
      className="max-width-fit-content margin-bottom-4"
      omitFormGroupClass={true}
    >
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
  handleBlur,
  handleChange,
  inCareOf,
  isOptional = false,
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
          handleBlur({
            validationKey: [type, 'inCareOf'],
          });
        }}
        onChange={e => {
          handleChange({
            key: e.target.name,
            value: e.target.value,
          });
        }}
      />
    </FormGroup>
  );
}

ContactSecondaryUpdated.displayName = 'ContactSecondaryUpdated';
