/* eslint-disable complexity */
import { Address } from './Address';
import { Country } from './Country';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InCareOf } from '@web-client/views/StartCase/ContactSecondaryUpdated';
import { InternationalAddress } from './InternationalAddress';
import { PlaceOfLegalResidenceDropdown } from '@web-client/views/StartCase/PlaceOfLegalResidenceDropdown';
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
  secondaryLabelNote?: string;
  secondaryLabel?: string;
  registerRef?: Function;
  titleLabel?: string;
  titleLabelNote?: string;
  placeOfLegalResidenceTitle?: string;
  showInCareOf?: boolean;
  showInCareOfOptional?: boolean;
  onChangeCountryType: string;
};

export const ContactPrimaryUpdated = connect(
  {
    bind: props.bind,
    constants: state.constants,
    data: state[props.bind],
    nameLabel: props.nameLabel,
    onBlur: props.onBlur,
    onBlurSequence: sequences[props.onBlur],
    onChange: props.onChange,
    onChangeCountryType: props.onChangeCountryType,
    onChangeSequence: sequences[props.onChange],
    placeOfLegalResidenceTitle: props.placeOfLegalResidenceTitle,
    registerRef: props.registerRef,
    secondaryLabel: props.secondaryLabel,
    secondaryLabelNote: props.secondaryLabelNote,
    showInCareOf: props.showInCareOf,
    showInCareOfOptional: props.showInCareOfOptional,
    titleLabel: props.titleLabel,
    titleLabelNote: props.titleLabelNote,
    validationErrors: state.validationErrors,
  },
  function ContactPrimaryUpdated({
    bind,
    constants,
    data,
    nameLabel,
    onBlur,
    onBlurSequence,
    onChange,
    onChangeCountryType,
    onChangeSequence,
    placeOfLegalResidenceTitle,
    registerRef,
    secondaryLabel,
    secondaryLabelNote,
    showInCareOf,
    showInCareOfOptional,
    titleLabel,
    titleLabelNote,
    validationErrors = {} as {
      contactPrimary?: {
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
            errorMessageId="primary-contact-name-error-message"
            errorText={
              validationErrors.contactPrimary &&
              validationErrors.contactPrimary.name
            }
          >
            <label className="usa-label" htmlFor="name">
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
              value={data.contactPrimary.name || ''}
              onBlur={() => {
                onBlurSequence({
                  validationKey: ['contactPrimary', 'name'],
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
                value={data.contactPrimary.secondaryName || ''}
                onBlur={() => {
                  onBlurSequence({
                    validationKey: ['contactPrimary', 'secondaryName'],
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
          )}

          {showInCareOf && (
            <InCareOf
              inCareOf={data.contactPrimary.inCareOf}
              isOptional={showInCareOfOptional}
              registerRef={registerRef}
              type="contactPrimary"
              validationErrors={validationErrors}
              onBlurSequence={onBlurSequence}
              onChangeSequence={onChangeSequence}
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
                value={data.contactPrimary.title || ''}
                onBlur={() => {
                  onBlurSequence({
                    validationKey: ['contactPrimary', 'title'],
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
          )}

          <Country
            bind={bind}
            registerRef={registerRef}
            type="contactPrimary"
            onBlur={onBlur}
            onChange={onChange}
            onChangeCountryType={onChangeCountryType}
          />

          {data.contactPrimary.countryType ===
            constants.COUNTRY_TYPES.DOMESTIC && (
            <Address
              bind={bind}
              registerRef={registerRef}
              type="contactPrimary"
              onBlur={onBlur}
              onChange={onChange}
            />
          )}

          {data.contactPrimary.countryType ===
            constants.COUNTRY_TYPES.INTERNATIONAL && (
            <InternationalAddress
              bind={bind}
              registerRef={registerRef}
              type="contactPrimary"
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          <PlaceOfLegalResidenceDropdown
            bind={bind}
            placeOfLegalResidenceTitle={placeOfLegalResidenceTitle}
            registerRef={registerRef}
            type="contactPrimary"
            // change - move to on change
            onBlurSequence={() => {
              onBlurSequence({
                validationKey: ['contactPrimary', 'placeOfLegalResidence'],
              });
            }}
            onChange={onChange}
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
            <span className="usa-hint">
              If you do not have a current phone number, enter N/A.
            </span>
            <input
              autoCapitalize="none"
              className="usa-input max-width-200"
              data-testid="contact-primary-phone"
              id="primary-phone"
              name="contactPrimary.phone"
              ref={registerRef && registerRef('contactPrimary.phone')}
              type="tel"
              value={data.contactPrimary.phone || ''}
              onBlur={() => {
                onBlurSequence({
                  validationKey: ['contactPrimary', 'phone'],
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
        </div>
      </>
    );
  },
);

ContactPrimaryUpdated.displayName = 'ContactPrimaryUpdated';
