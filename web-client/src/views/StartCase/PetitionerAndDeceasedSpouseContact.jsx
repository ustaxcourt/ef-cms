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
  function PetitionerAndDeceasedSpouseContact({
    form,
    updateFormValueSequence,
    validationErrors,
    validateStartCaseSequence,
  }) {
    validationErrors.contactPrimary = validationErrors.contactPrimary || {};
    validationErrors.contactSecondary = validationErrors.contactSecondary || {};
    return (
      <React.Fragment>
        <div className="usa-form-group contact-group">
          <h3>Tell Us About Yourself</h3>
          <div className="blue-container">
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactPrimary.name ? 'usa-input-error' : '')
              }
            >
              <label htmlFor="name">Name</label>
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
        <div className="usa-form-group">
          <h3>Tell Us About Your Deceased Spouse</h3>
          <div className="blue-container">
            <div
              className={
                'usa-form-group ' +
                (validationErrors.contactSecondary.name
                  ? 'usa-input-error'
                  : '')
              }
            >
              <label htmlFor="secondaryName">Spouse&#39;s Name</label>
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
            <Address type="contactSecondary" />
          </div>
        </div>
      </React.Fragment>
    );
  },
);
