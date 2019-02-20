import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import Address from './Address';
import Email from './Email';

export default connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
    validateStartCaseSequence: sequences.validateStartCaseSequence,
  },
  function CorporationContact({
    form,
    updateFormValueSequence,
    validationErrors,
    validateStartCaseSequence,
  }) {
    validationErrors.contactPrimary = validationErrors.contactPrimary || {};
    return (
      <div className="usa-form-group contact-group">
        <h3>Tell Us About the Corporation You Are Filing For</h3>
        <div className="blue-container">
          <div
            className={
              'usa-form-group ' +
              (validationErrors.contactPrimary.name ? 'usa-input-error' : '')
            }
          >
            <label htmlFor="name">Business Name</label>
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
            <div className="usa-input-error-message beneath">
              {validationErrors.contactPrimary.name}
            </div>
          </div>
          <div
            className={
              'usa-form-group ' +
              (validationErrors.contactPrimary.inCareOf
                ? 'usa-input-error'
                : '')
            }
          >
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
              onBlur={() => {
                validateStartCaseSequence();
              }}
            />
            <div className="usa-input-error-message beneath">
              {validationErrors.contactPrimary.inCareOf}
            </div>
          </div>
          <Address type="contactPrimary" />
          <Email />
          <div
            className={
              'usa-form-group ' +
              (validationErrors.contactPrimary.phone ? 'usa-input-error' : '')
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
            <div className="usa-input-error-message beneath">
              {validationErrors.contactPrimary.phone}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
