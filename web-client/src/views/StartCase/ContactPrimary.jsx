import { connect } from '@cerebral/react';
import { sequences, state, props } from 'cerebral';
import React from 'react';

import { Address } from './Address';
import { Country } from './Country';
import { Email } from './Email';
import { InternationalAddress } from './InternationalAddress';

export const ContactPrimary = connect(
  {
    parentView: props.parentView,
    bind: props.bind,
    emailBind: props.emailBind,
    data: state[props.bind],
    constants: state.constants,
    onChange: props.onChange,
    onChangeSequence: sequences[props.onChange],
    validationErrors: state.validationErrors,
    onBlur: props.onBlur,
    onBlurSequence: sequences[props.onBlur],
    contactsHelper: state[props.contactsHelper],
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
            {validationErrors.contactPrimary && (
              <div className="usa-input-error-message beneath">
                {validationErrors.contactPrimary.name}
              </div>
            )}
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
              {validationErrors.contactPrimary && (
                <div className="usa-input-error-message beneath">
                  {validationErrors.contactPrimary.inCareOf}
                </div>
              )}
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
            {validationErrors.contactPrimary && (
              <div className="usa-input-error-message beneath">
                {validationErrors.contactPrimary.phone}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
