import { Address } from './Address';
import { Country } from './Country';
import { InternationalAddress } from './InternationalAddress';
import { Text } from '../../ustc-ui/Text/Text';
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
    parentView,
    bind,
    data,
    constants,
    onChange,
    onChangeSequence,
    validationErrors,
    onBlur,
    onBlurSequence,
    contactsHelper,
  }) => {
    return (
      <>
        {parentView === 'StartCase' ? (
          <h2 className="margin-top-4">
            {contactsHelper.contactSecondary.header}
          </h2>
        ) : (
          <h4>{contactsHelper.contactSecondary.header}</h4>
        )}
        <div className="blue-container contact-group">
          <Country
            type="contactSecondary"
            bind={bind}
            onChange={onChange}
            onBlur={onBlur}
          />
          <div
            className={
              'usa-form-group ' +
              (validationErrors.contactSecondary &&
              validationErrors.contactSecondary.name
                ? 'usa-form-group--error'
                : '')
            }
          >
            <label htmlFor="secondaryName" className="usa-label">
              {contactsHelper.contactSecondary.nameLabel}
            </label>
            <input
              id="secondaryName"
              type="text"
              name="contactSecondary.name"
              autoCapitalize="none"
              className="usa-input"
              value={data.contactSecondary.name || ''}
              onChange={e => {
                onChangeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                onBlurSequence();
              }}
            />
            <Text
              className="usa-error-message"
              bind="validationErrors.contactSecondary.name"
            />
          </div>
          {contactsHelper.contactSecondary.displayInCareOf && (
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactSecondary &&
                validationErrors.contactSecondary.inCareOf
                  ? 'usa-form-group--error'
                  : '')
              }
            >
              <label htmlFor="secondaryInCareOf" className="usa-label">
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
                    In Care Of <span className="usa-hint">(optional)</span>
                  </span>
                )}
              </label>
              <input
                id="secondaryInCareOf"
                type="text"
                name="contactSecondary.inCareOf"
                autoCapitalize="none"
                className="usa-input"
                value={data.contactSecondary.inCareOf || ''}
                onChange={e => {
                  onChangeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
                onBlur={() => {
                  onBlurSequence();
                }}
              />
              <Text
                className="usa-error-message"
                bind="validationErrors.contactSecondary.inCareOf"
              />
            </div>
          )}
          {data.contactSecondary.countryType ===
            constants.COUNTRY_TYPES.DOMESTIC && (
            <Address
              type="contactSecondary"
              bind={bind}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
          {data.contactSecondary.countryType ===
            constants.COUNTRY_TYPES.INTERNATIONAL && (
            <InternationalAddress
              type="contactSecondary"
              bind={bind}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
          {contactsHelper.contactSecondary.displayPhone && (
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactSecondary &&
                validationErrors.contactSecondary.phone
                  ? 'usa-form-group--error'
                  : '')
              }
            >
              <label htmlFor="secondaryPhone" className="usa-label">
                Phone Number
              </label>
              <input
                id="secondaryPhone"
                type="tel"
                name="contactSecondary.phone"
                className="usa-input"
                autoCapitalize="none"
                value={data.contactSecondary.phone || ''}
                onChange={e => {
                  onChangeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
                onBlur={() => {
                  onBlurSequence();
                }}
              />
              <Text
                className="usa-error-message"
                bind="validationErrors.contactSecondary.phone"
              />
            </div>
          )}
        </div>
      </>
    );
  },
);
