import { Address } from './Address';
import { Country } from './Country';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './InternationalAddress';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
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
    validationErrors: state.validationErrors,
  },
  ({
    bind,
    constants,
    contactsHelper,
    data,
    onBlur,
    onBlurSequence,
    onChange,
    onChangeSequence,
    parentView,
    validationErrors,
  }) => {
    return (
      <>
        {parentView === 'StartCase' ? (
          <h3 className="margin-top-4">
            {contactsHelper.contactSecondary.header}
          </h3>
        ) : (
          <h4>{contactsHelper.contactSecondary.header}</h4>
        )}
        <div className="blue-container contact-group">
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
          {contactsHelper.contactSecondary.displayPhone && (
            <FormGroup
              errorText={
                validationErrors.contactSecondary &&
                validationErrors.contactSecondary.phone
              }
            >
              <label className="usa-label" htmlFor="secondaryPhone">
                Phone number
                {contactsHelper.contactSecondary.phoneNumberLabelHint && (
                  <>
                    {' '}
                    <span className="usa-hint">
                      ({contactsHelper.contactSecondary.phoneNumberLabelHint})
                    </span>
                  </>
                )}
              </label>
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
