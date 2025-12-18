/* eslint-disable complexity */
import {
  MAX_PREFERRED_COMMUNICATION_METHOD_CHARACTERS,
  MAX_PREFERRED_LANGUAGE_CHARACTERS,
} from '@shared/business/entities/EntityConstants';
import {
  AddressType,
  AddressUpdated,
  OnBlurHandler,
  OnChangeCountryTypeHandler,
  OnChangeHandler,
} from '@web-client/views/StartCase/AddressUpdated';
import { CountryUpdated } from '@web-client/views/StartCase/CountryUpdated';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InCareOf } from '@web-client/views/StartCase/ContactSecondaryUpdated';
import { InternationalAddressUpdated } from '@web-client/views/StartCase/InternationalAddressUpdated';
import { PlaceOfLegalResidenceDropdown } from '@web-client/views/StartCase/PlaceOfLegalResidenceDropdown';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type ContactPrimaryUpdate = {
  addressInfo: AddressType;
  nameLabel: string;
  handleBlur: OnBlurHandler;
  handleChange: OnChangeHandler;
  handleChangeCountryType: OnChangeCountryTypeHandler;
  isPetitioner?: boolean;
  placeOfLegalResidenceTitle?: string;
  registerRef?: Function;
  secondaryLabel?: string;
  secondaryLabelNote?: string;
  showEmail?: boolean;
  showInCareOf?: boolean;
  showInCareOfOptional?: boolean;
  showLanguageFields?: boolean;
  titleLabel?: string;
  titleLabelNote?: string;
};

const contactPrimaryDependencies = {
  constants: state.constants,
  validationErrors: state.validationErrors,
};

export const ContactPrimaryUpdated = connect<
  ContactPrimaryUpdate,
  typeof contactPrimaryDependencies
>(
  contactPrimaryDependencies,
  function ContactPrimaryUpdated({
    addressInfo,
    constants,
    handleBlur,
    handleChange,
    handleChangeCountryType,
    isPetitioner = false,
    nameLabel,
    placeOfLegalResidenceTitle,
    registerRef,
    secondaryLabel,
    secondaryLabelNote,
    showEmail,
    showInCareOf,
    showInCareOfOptional,
    showLanguageFields,
    titleLabel,
    titleLabelNote,
    validationErrors,
  }) {
    const preferredLanguageLabel = isPetitioner
      ? 'If you have difficulty communicating in English, please state your preferred language:'
      : "If petitioner has difficulty communicating in English, please state the petitioner's preferred language:";

    const preferredCommunicationLabel = isPetitioner
      ? 'If you are deaf or hard of hearing, please state your preferred method of communication (ASL, TTY, etc.):'
      : "If petitioner is deaf or hard of hearing, please state the petitioner's preferred method of communication (ASL, TTY, etc.):";

    return (
      <>
        <div>
          <FormGroup
            errorMessageId="primary-contact-name-error-message"
            errorText={
              validationErrors.contactPrimary &&
              validationErrors.contactPrimary.name
            }
          >
            <label
              className="usa-label"
              data-testid="contact-primary-name-label"
              htmlFor="contactPrimary.name"
            >
              {nameLabel}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              data-testid="contact-primary-name"
              id="contactPrimary.name"
              name="contactPrimary.name"
              ref={registerRef && registerRef('contactPrimary.name')}
              type="text"
              value={addressInfo.name || ''}
              onBlur={() => {
                handleBlur({
                  validationKey: ['contactPrimary', 'name'],
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
          {secondaryLabel && (
            <FormGroup
              errorMessageId="primary-secondary-contact-name-error-message"
              errorText={
                validationErrors.contactPrimary &&
                validationErrors.contactPrimary.secondaryName
              }
            >
              <label className="usa-label" htmlFor="secondaryName">
                {secondaryLabel}
                {secondaryLabelNote && (
                  <>
                    {' '}
                    <span className="usa-hint">({secondaryLabelNote})</span>
                  </>
                )}
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                data-testid="contact-primary-secondary-name"
                id="secondaryName"
                name="contactPrimary.secondaryName"
                ref={registerRef && registerRef('contactPrimary.secondaryName')}
                type="text"
                value={addressInfo.secondaryName || ''}
                onBlur={() => {
                  handleBlur({
                    validationKey: ['contactPrimary', 'secondaryName'],
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
          )}

          {showInCareOf && (
            <InCareOf
              handleBlur={handleBlur}
              handleChange={handleChange}
              inCareOf={addressInfo.inCareOf}
              isOptional={showInCareOfOptional}
              registerRef={registerRef}
              type="contactPrimary"
              validationErrors={validationErrors}
            />
          )}

          {titleLabel && (
            <FormGroup
              errorMessageId="primary-contact-title-error-message"
              errorText={
                validationErrors.contactPrimary &&
                validationErrors.contactPrimary.title
              }
            >
              <label className="usa-label" htmlFor="title">
                {titleLabel}
                {titleLabelNote && (
                  <>
                    {' '}
                    <span className="usa-hint">({titleLabelNote})</span>
                  </>
                )}
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                data-testid="contact-primary-title"
                id="title"
                name="contactPrimary.title"
                ref={registerRef && registerRef('contactPrimary.title')}
                type="text"
                value={addressInfo.title || ''}
                onBlur={() => {
                  handleBlur({
                    validationKey: ['contactPrimary', 'title'],
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
          )}

          <CountryUpdated
            addressInfo={addressInfo}
            handleBlur={handleBlur}
            handleChange={handleChangeCountryType}
            registerRef={registerRef}
            type="contactPrimary"
          />

          {addressInfo.countryType === constants.COUNTRY_TYPES.DOMESTIC && (
            <AddressUpdated
              addressInfo={addressInfo}
              handleBlur={handleBlur}
              handleChange={handleChange}
              registerRef={registerRef}
              type="contactPrimary"
            />
          )}

          {addressInfo.countryType ===
            constants.COUNTRY_TYPES.INTERNATIONAL && (
            <InternationalAddressUpdated
              addressInfo={addressInfo}
              handleBlur={handleBlur}
              handleChange={handleChange}
              registerRef={registerRef}
              type="contactPrimary"
            />
          )}
          <PlaceOfLegalResidenceDropdown
            addressInfo={addressInfo}
            handleBlur={() => {
              handleBlur({
                validationKey: ['contactPrimary', 'placeOfLegalResidence'],
              });
            }}
            handleChange={handleChange}
            placeOfLegalResidenceTitle={placeOfLegalResidenceTitle}
            registerRef={registerRef}
            type="contactPrimary"
          />

          <FormGroup
            className="phone-input"
            errorMessageId="phone-error-message"
            errorText={
              validationErrors.contactPrimary &&
              validationErrors.contactPrimary.phone
            }
          >
            <label className="usa-label" htmlFor="primary-phone">
              Phone number
            </label>
            <span
              className="usa-hint"
              data-testid="contact-primary-phone-message"
            >
              If there is no phone number, enter N/A.
            </span>
            <input
              autoCapitalize="none"
              className="usa-input max-width-200"
              data-testid="contact-primary-phone"
              id="primary-phone"
              name="contactPrimary.phone"
              ref={registerRef && registerRef('contactPrimary.phone')}
              type="text"
              value={addressInfo.phone || ''}
              onBlur={() => {
                handleBlur({
                  validationKey: ['contactPrimary', 'phone'],
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
          {showEmail && (
            <FormGroup
              errorMessageId="email-error-message"
              errorText={
                validationErrors.contactPrimary &&
                validationErrors.contactPrimary.paperPetitionEmail
              }
            >
              <label className="usa-label" htmlFor="paperPetitionEmail">
                Email address <span className="usa-hint">(Optional)</span>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                data-testid="contact-primary-paper-petition-email"
                id="paperPetitionEmail"
                name="contactPrimary.paperPetitionEmail"
                ref={
                  registerRef &&
                  registerRef('contactPrimary.paperPetitionEmail')
                }
                type="text"
                value={addressInfo.paperPetitionEmail || ''}
                onBlur={() => {
                  handleBlur({
                    validationKey: ['contactPrimary', 'paperPetitionEmail'],
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
          )}
          {showLanguageFields && (
            <>
              <FormGroup
                className="preferred-language-form-group"
                errorMessageId="contact-primary-preferred-language-error-message"
                errorText={
                  validationErrors.contactPrimary &&
                  validationErrors.contactPrimary.preferredLanguage
                }
              >
                <label
                  className="usa-label"
                  htmlFor="contactPrimary.preferredLanguage"
                >
                  {preferredLanguageLabel}
                  <br />
                  <span
                    className="usa-hint"
                    id="contactPrimary.preferredLanguage-hint"
                  >
                    (Optional)
                  </span>
                </label>
                <input
                  aria-describedby="contactPrimary.preferredLanguage-hint"
                  autoCapitalize="none"
                  className="usa-input"
                  data-testid="contact-primary-preferred-language"
                  id="contactPrimary.preferredLanguage"
                  maxLength={MAX_PREFERRED_LANGUAGE_CHARACTERS}
                  name="contactPrimary.preferredLanguage"
                  ref={
                    registerRef &&
                    registerRef('contactPrimary.preferredLanguage')
                  }
                  type="text"
                  value={addressInfo.preferredLanguage || ''}
                  onBlur={() => {
                    handleBlur({
                      validationKey: ['contactPrimary', 'preferredLanguage'],
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
                className="preferred-communication-form-group"
                errorMessageId="contact-primary-preferred-communication-method-error-message"
                errorText={
                  validationErrors.contactPrimary &&
                  validationErrors.contactPrimary.preferredCommunicationMethod
                }
              >
                <label
                  className="usa-label"
                  htmlFor="contactPrimary.preferredCommunicationMethod"
                >
                  {preferredCommunicationLabel}
                  <br />
                  <span
                    className="usa-hint"
                    id="contactPrimary.preferredCommunicationMethod-hint"
                  >
                    (Optional)
                  </span>
                </label>
                <input
                  aria-describedby="contactPrimary.preferredCommunicationMethod-hint"
                  autoCapitalize="none"
                  className="usa-input"
                  data-testid="contact-primary-preferred-communication-method"
                  id="contactPrimary.preferredCommunicationMethod"
                  maxLength={MAX_PREFERRED_COMMUNICATION_METHOD_CHARACTERS}
                  name="contactPrimary.preferredCommunicationMethod"
                  ref={
                    registerRef &&
                    registerRef('contactPrimary.preferredCommunicationMethod')
                  }
                  type="text"
                  value={addressInfo.preferredCommunicationMethod || ''}
                  onBlur={() => {
                    handleBlur({
                      validationKey: [
                        'contactPrimary',
                        'preferredCommunicationMethod',
                      ],
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
            </>
          )}
        </div>
      </>
    );
  },
);

ContactPrimaryUpdated.displayName = 'ContactPrimaryUpdated';
