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
  function PetitionerContact({
    form,
    updateFormValueSequence,
    validationErrors,
    validateStartCaseSequence,
  }) {
    return (
      <div className="usa-form-group">
        <h3>Tell Us About Yourself</h3>
        <div className="blue-container">
          <div
            className={
              'usa-form-group ' +
              (validationErrors.contactPrimary &&
              validationErrors.contactPrimary.name
                ? 'usa-input-error'
                : '')
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
            {validationErrors.contactPrimary && (
              <div className="usa-input-error-message beneath">
                {validationErrors.contactPrimary.name}
              </div>
            )}
          </div>
          <Address type="contactPrimary" />
          <Email type="contactPrimary" />
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
