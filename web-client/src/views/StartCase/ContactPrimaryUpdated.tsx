import { Address } from './Address';
import { Country } from './Country';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
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
  displayInCareOf?: boolean;
  showPlaceOfLegalResidence?: boolean;
  secondaryLabelNote?: string;
  secondaryLabel?: string;
  additionalLabel?: string;
  additionalLabelNote?: string;
  placeOfLegalResidenceTitle?: string;
};

export const ContactPrimaryUpdated = connect(
  {
    additionalLabel: props.additionalLabel,
    additionalLabelNote: props.additionalLabelNote,
    bind: props.bind,
    constants: state.constants,
    data: state[props.bind],
    nameLabel: props.nameLabel,
    onBlur: props.onBlur,
    onBlurSequence: sequences[props.onBlur],
    onChange: props.onChange,
    onChangeSequence: sequences[props.onChange],
    placeOfLegalResidenceTitle: props.placeOfLegalResidenceTitle,
    secondaryLabel: props.secondaryLabel,
    secondaryLabelNote: props.secondaryLabelNote,
    showPlaceOfLegalResidence: props.showPlaceOfLegalResidence,
    updateFormValueAndSecondaryContactInfoSequence:
      sequences.updateFormValueAndSecondaryContactInfoSequence,
    validationErrors: state.validationErrors,
  },
  function ContactPrimaryUpdated({
    additionalLabel,
    additionalLabelNote,
    bind,
    constants,
    data,
    nameLabel,
    onBlur,
    onBlurSequence,
    onChange,
    onChangeSequence,
    placeOfLegalResidenceTitle,
    secondaryLabel,
    secondaryLabelNote,
    showPlaceOfLegalResidence,
    updateFormValueAndSecondaryContactInfoSequence,
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
              id="name"
              name="contactPrimary.name"
              type="text"
              value={data.contactPrimary.name || ''}
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
          {secondaryLabel && (
            <FormGroup
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
                type="text"
                value={data.contactPrimary.secondaryName || ''}
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
          {additionalLabel && (
            <FormGroup>
              <label className="usa-label" htmlFor="inCareOf">
                {additionalLabel}
                {additionalLabelNote && (
                  <>
                    {' '}
                    <span className="usa-hint">({additionalLabelNote})</span>
                  </>
                )}
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                data-testid="contact-primary-title"
                id="title"
                name="contactPrimary.title"
                type="text"
                value={data.contactPrimary.title || ''}
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
            type="contactPrimary"
            onBlur={onBlur}
            onChange={onChange}
          />

          {data.contactPrimary.countryType ===
            constants.COUNTRY_TYPES.DOMESTIC && (
            <Address
              bind={bind}
              type="contactPrimary"
              onBlur={onBlur}
              onChange="updateFormValueAndSecondaryContactInfoSequence"
            />
          )}

          {data.contactPrimary.countryType ===
            constants.COUNTRY_TYPES.INTERNATIONAL && (
            <InternationalAddress
              bind={bind}
              type="contactPrimary"
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
          {showPlaceOfLegalResidence && (
            <PlaceOfLegalResidenceDropdown
              bind={bind}
              placeOfLegalResidenceTitle={placeOfLegalResidenceTitle}
              type="contactPrimary"
              onChange={onChange}
            />
          )}

          <FormGroup
            className="phone-input"
            errorText={
              validationErrors.contactPrimary &&
              validationErrors.contactPrimary.phone
            }
          >
            <label className="usa-label" htmlFor="phone">
              Phone number
            </label>
            <span className="usa-hint">
              If you do not have a current phone number, enter N/A.
            </span>
            <input
              autoCapitalize="none"
              className="usa-input max-width-200"
              data-testid="phone"
              id="phone"
              name="contactPrimary.phone"
              type="tel"
              value={data.contactPrimary.phone || ''}
              onBlur={() => {
                onBlurSequence();
              }}
              onChange={e => {
                updateFormValueAndSecondaryContactInfoSequence({
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
