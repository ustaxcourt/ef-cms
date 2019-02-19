import { connect } from '@cerebral/react';
import { sequences, state, props } from 'cerebral';
import React from 'react';
import Address from './Address';
import Email from './Email';

export default connect(
  {
    form: state.form,
    header: props.header,
    nameLabel: props.nameLabel,
    displayTitle: props.displayTitle,
    displayInCareOf: props.displayInCareOf,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
    validateStartCaseSequence: sequences.validateStartCaseSequence,
  },
  function ContactPrimary({
    form,
    header,
    nameLabel,
    displayTitle,
    displayInCareOf,
    updateFormValueSequence,
    validationErrors,
    validateStartCaseSequence,
  }) {
    return (
      <div className="usa-form-group contact-group">
        <h3>{header}</h3>
        <div className="blue-container usa-grid-full">
          <div
            className={
              'usa-form-group ' +
              (validationErrors.contactPrimary &&
              validationErrors.contactPrimary.name
                ? 'usa-input-error'
                : '')
            }
          >
            <label htmlFor="name">{nameLabel}</label>
            <input
              id="name"
              type="text"
              name="contactPrimary.name"
              autoCapitalize="none"
              value={form.contactPrimary.name || ''}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                validateStartCaseSequence();
              }}
            />
            {validationErrors.contactPrimary && (
              <div className="usa-input-error-message beneath">
                {validationErrors.contactPrimary.name}
              </div>
            )}
          </div>
          {displayTitle && (
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
                value={form.contactPrimary.title || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
          )}
          {displayInCareOf && (
            <div className="usa-form-group">
              <label htmlFor="inCareOf">
                In Care Of <span className="usa-form-hint">(optional)</span>
              </label>
              <input
                id="inCareOf"
                type="text"
                name="contactPrimary.inCareOf"
                autoCapitalize="none"
                value={form.contactPrimary.inCareOf || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
          )}
          <Address type="contactPrimary" />
          <Email />
          <div
            className={
              'usa-form-group ' +
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
              value={form.contactPrimary.phone || ''}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                validateStartCaseSequence();
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
