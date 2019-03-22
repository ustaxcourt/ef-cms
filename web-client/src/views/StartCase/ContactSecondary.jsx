import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

import { Address } from './Address';
import { Country } from './Country';
import { InternationalAddress } from './InternationalAddress';
import { Text } from '../../ustc-ui/Text/Text';

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
      <div className="contact-group">
        {parentView === 'CaseDetail' ? (
          <h4>{contactsHelper.contactSecondary.header}</h4>
        ) : (
          <h3>{contactsHelper.contactSecondary.header}</h3>
        )}
        <div className="blue-container">
          <Country
            type="contactSecondary"
            bind={bind}
            onChange={onChange}
            onBlur={onBlur}
          />
          <div
            className={
              'ustc-form-group ' +
              (validationErrors.contactSecondary &&
              validationErrors.contactSecondary.name
                ? 'usa-input-error'
                : '')
            }
          >
            <label htmlFor="secondaryName">
              {contactsHelper.contactSecondary.nameLabel}
            </label>
            <input
              id="secondaryName"
              type="text"
              name="contactSecondary.name"
              autoCapitalize="none"
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
              className="usa-input-error-message"
              bind="validationErrors.contactSecondary.name"
            />
          </div>
          {contactsHelper.contactSecondary.displayInCareOf && (
            <div
              className={
                'ustc-form-group ' +
                (validationErrors.contactSecondary &&
                validationErrors.contactSecondary.inCareOf
                  ? 'usa-input-error'
                  : '')
              }
            >
              <label htmlFor="secondaryInCareOf">
                {contactsHelper.contactSecondary.inCareOfLabel ? (
                  <span>
                    {contactsHelper.contactSecondary.inCareOfLabel}{' '}
                    {contactsHelper.contactSecondary.inCareOfLabelHint && (
                      <span className="usa-form-hint">
                        ({contactsHelper.contactSecondary.inCareOfLabelHint})
                      </span>
                    )}
                  </span>
                ) : (
                  <span>
                    In Care Of <span className="usa-form-hint">(optional)</span>
                  </span>
                )}
              </label>
              <input
                id="secondaryInCareOf"
                type="text"
                name="contactSecondary.inCareOf"
                autoCapitalize="none"
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
                className="usa-input-error-message"
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
                'ustc-form-group ' +
                (validationErrors.contactSecondary &&
                validationErrors.contactSecondary.phone
                  ? 'usa-input-error'
                  : '')
              }
            >
              <label htmlFor="secondaryPhone">Phone Number</label>
              <input
                id="secondaryPhone"
                type="tel"
                name="contactSecondary.phone"
                className="ustc-input-phone"
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
                className="usa-input-error-message"
                bind="validationErrors.contactSecondary.phone"
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);
