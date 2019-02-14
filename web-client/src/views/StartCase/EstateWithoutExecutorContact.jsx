import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import Address from './Address';

export default connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function EstateWithoutExecutorContact({ form, updateFormValueSequence }) {
    return (
      <div>
        <div className="usa-form-group">
          <h3>Tell Us About the Estate You Are Filing For</h3>
          <div className="blue-container">
            <div className="usa-form-group">
              <label htmlFor="name">Name of Decedent</label>
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
            <div className="usa-form-group">
              <label htmlFor="inCareOf">In Care Of</label>
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
      </div>
    );
  },
);
