import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

import { Address } from './Address';
import { Country } from './Country';
import { Email } from './Email';
import { InternationalAddress } from './InternationalAddress';
import { Text } from '../../ustc-ui/Text/Text';

export const ContactPrimary = connect(
  {
    bind: props.bind,
    constants: state.constants,
    contactsHelper: state[props.contactsHelper],
    data: state[props.bind],
    emailBind: props.emailBind,
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
    emailBind,
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
      <div className="usa-form-group contact-group">
        {parentView === 'StartCase' ? (
          <h3>{contactsHelper.contactPrimary.header}</h3>
        ) : (
          <h4>{contactsHelper.contactPrimary.header}</h4>
        )}
        <div className="blue-container usa-grid-full">
          <Country
            type="contactPrimary"
            bind={bind}
            onChange={onChange}
            onBlur={onBlur}
          />
          <div
            className={
              'usa-form-group ' +
              (validationErrors.contactPrimary &&
              validationErrors.contactPrimary.name
                ? 'usa-input-error'
                : '')
            }
          >
            <label htmlFor="name">
              {contactsHelper.contactPrimary.nameLabel}
            </label>
            <input
              id="name"
              type="text"
              name="contactPrimary.name"
              autoCapitalize="none"
              value={data.contactPrimary.name || ''}
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
              bind="validationErrors.contactPrimary.name"
            />
          </div>
          {contactsHelper.contactPrimary.displayTitle && (
            <div className="usa-form-group">
              <label htmlFor="title">
                Title
                <p className="usa-form-hint">For example, Executor, PR, etc.</p>
              </label>
              <input
                id="title"
                type="text"
                name="contactPrimary.title"
                autoCapitalize="none"
                value={data.contactPrimary.title || ''}
                onChange={e => {
                  onChangeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
          )}
          {contactsHelper.contactPrimary.displayInCareOf && (
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactPrimary &&
                validationErrors.contactPrimary.inCareOf
                  ? 'usa-input-error'
                  : '')
              }
            >
              <label htmlFor="inCareOf">
                {contactsHelper.contactPrimary.inCareOfLabel ? (
                  <span>
                    {contactsHelper.contactPrimary.inCareOfLabel}{' '}
                    {contactsHelper.contactPrimary.inCareOfLabelHint && (
                      <span className="usa-form-hint">
                        ({contactsHelper.contactPrimary.inCareOfLabelHint})
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
                id="inCareOf"
                type="text"
                name="contactPrimary.inCareOf"
                autoCapitalize="none"
                value={data.contactPrimary.inCareOf || ''}
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
                bind="validationErrors.contactPrimary.inCareOf"
              />
            </div>
          )}
          {data.contactPrimary.countryType ===
            constants.COUNTRY_TYPES.DOMESTIC && (
            <Address
              type="contactPrimary"
              bind={bind}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
          {data.contactPrimary.countryType ===
            constants.COUNTRY_TYPES.INTERNATIONAL && (
            <InternationalAddress
              type="contactPrimary"
              bind={bind}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
          <Email bind={emailBind} />
          <div
            className={
              'usa-form-group phone-input ' +
              (validationErrors.contactPrimary &&
              validationErrors.contactPrimary.phone
                ? 'usa-input-error'
                : '')
            }
          >
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              name="contactPrimary.phone"
              className="ustc-input-phone"
              autoCapitalize="none"
              value={data.contactPrimary.phone || ''}
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
              bind="validationErrors.contactPrimary.phone"
            />
          </div>
        </div>
      </div>
    );
  },
);
