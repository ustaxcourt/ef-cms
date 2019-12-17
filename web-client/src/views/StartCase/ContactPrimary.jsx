import { Address } from './Address';
import { Country } from './Country';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './InternationalAddress';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const ContactPrimary = connect(
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
            {contactsHelper.contactPrimary.header}
          </h3>
        ) : (
          <h4>{contactsHelper.contactPrimary.header}</h4>
        )}
        <div className="blue-container contact-group">
          <FormGroup
            errorText={
              validationErrors.contactPrimary &&
              validationErrors.contactPrimary.name
            }
          >
            <label className="usa-label" htmlFor="name">
              {contactsHelper.contactPrimary.nameLabel}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
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

          {contactsHelper.contactPrimary.displaySecondaryName && (
            <FormGroup
              errorText={
                validationErrors &&
                validationErrors.contactPrimary &&
                validationErrors.contactPrimary.secondaryName
              }
            >
              <label className="usa-label" htmlFor="secondary-name">
                {contactsHelper.contactPrimary.secondaryNameLabel}
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="secondary-name"
                name="contactPrimary.secondaryName"
                type="text"
                value={data.contactPrimary.secondaryName || ''}
                onChange={e => {
                  onChangeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          )}

          {contactsHelper.contactPrimary.displayTitle && (
            <div className="usa-form-group">
              <label className="usa-label with-hint" htmlFor="title">
                Title{' '}
                {contactsHelper.contactPrimary.titleHint && (
                  <span className="usa-hint">
                    ({contactsHelper.contactPrimary.titleHint})
                  </span>
                )}
              </label>
              <span className="usa-hint">For example, executor, PR, etc.</span>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="title"
                name="contactPrimary.title"
                type="text"
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
            <FormGroup
              errorText={
                validationErrors.contactPrimary &&
                validationErrors.contactPrimary.inCareOf
              }
            >
              <label className="usa-label" htmlFor="inCareOf">
                {contactsHelper.contactPrimary.inCareOfLabel ? (
                  <span>
                    {contactsHelper.contactPrimary.inCareOfLabel}{' '}
                    {contactsHelper.contactPrimary.inCareOfLabelHint && (
                      <span className="usa-hint">
                        ({contactsHelper.contactPrimary.inCareOfLabelHint})
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
                id="inCareOf"
                name="contactPrimary.inCareOf"
                type="text"
                value={data.contactPrimary.inCareOf || ''}
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
              onChange={onChange}
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
          <FormGroup
            className="phone-input"
            errorText={
              validationErrors.contactPrimary &&
              validationErrors.contactPrimary.phone
            }
          >
            <label className="usa-label" htmlFor="phone">
              Phone number
              {contactsHelper.contactPrimary.phoneNumberLabelHint && (
                <>
                  {' '}
                  <span className="usa-hint">
                    ({contactsHelper.contactPrimary.phoneNumberLabelHint})
                  </span>
                </>
              )}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input max-width-200"
              id="phone"
              name="contactPrimary.phone"
              type="tel"
              value={data.contactPrimary.phone || ''}
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
        </div>
      </>
    );
  },
);
