import { connect } from '@cerebral/react';
import { sequences, state, props } from 'cerebral';
import React from 'react';
import Address from './Address';

export default connect(
  {
    form: state.form,
    header: props.header,
    nameLabel: props.nameLabel,
    displayInCareOf: props.displayInCareOf,
    displayPhone: props.displayPhone,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
    validateStartCaseSequence: sequences.validateStartCaseSequence,
  },
  function ContactSecondary({
    form,
    header,
    nameLabel,
    displayPhone,
    displayInCareOf,
    updateFormValueSequence,
    validationErrors,
    validateStartCaseSequence,
  }) {
    validationErrors.contactPrimary = validationErrors.contactPrimary || {};
    validationErrors.contactSecondary = validationErrors.contactSecondary || {};

    return (
      <div className="usa-form-group">
        <h3>{header}</h3>
        <div className="blue-container">
          <div
            className={
              'usa-form-group ' +
              (validationErrors.contactSecondary.name ? 'usa-input-error' : '')
            }
          >
            <label htmlFor="secondaryName">{nameLabel}</label>
            <input
              id="secondaryName"
              type="text"
              name="contactSecondary.name"
              autoCapitalize="none"
              value={form.contactSecondary.name || ''}
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
            <div className="usa-input-error-message beneath">
              {validationErrors.contactSecondary.name}
            </div>
          </div>
          {displayInCareOf && (
            <div className="usa-form-group">
              <label htmlFor="secondaryInCareOf">
                In Care Of <span className="usa-form-hint">(optional)</span>
              </label>
              <input
                id="secondaryInCareOf"
                type="text"
                name="contactSecondary.inCareOf"
                autoCapitalize="none"
                value={form.contactSecondary.inCareOf || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
          )}
          <Address type="contactSecondary" />
          {displayPhone && (
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactSecondary.phone
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
                value={form.contactSecondary.phone || ''}
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
              <div className="usa-input-error-message beneath">
                {validationErrors.contactSecondary.phone}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
