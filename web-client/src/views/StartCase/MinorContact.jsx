import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import Address from './Address';

export default connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function MinorContact({ form, updateFormValueSequence }) {
    return (
      <div>
        <div className="usa-form-group">
          <h3>Tell Us About the Next Friend for This Minor</h3>
          <div className="blue-container">
            <div className="usa-form-group">
              <label htmlFor="name">Name of Next Friend</label>
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
              />
            </div>
            <Address type="contactPrimary" />
            <div className="usa-form-group">
              <label htmlFor="email">Email Address</label>
              {form.contactPrimary.email || 'test@test.com'}
            </div>
            <div className="usa-form-group">
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
              />
            </div>
          </div>
        </div>
        <div className="usa-form-group">
          <h3>Tell Us About the Minor You Are Filing For</h3>
          <div className="blue-container">
            <div className="usa-form-group">
              <label htmlFor="secondaryName">Name of Minor</label>
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
              />
            </div>
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
            <Address type="contactSecondary" />
            <div className="usa-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="contactSecondary.email"
                autoCapitalize="none"
                value={form.contactSecondary.email || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
            <div className="usa-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
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
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
