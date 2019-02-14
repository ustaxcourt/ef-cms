import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import Address from './Address';

export default connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function EstateWithExecutorContact({ form, updateFormValueSequence }) {
    return (
      <div>
        <div className="usa-form-group">
          <h3>
            Tell Us About Yourself as the Executor/Personal Representative For
            This Estate
          </h3>
          <div className="blue-container">
            <div className="usa-form-group">
              <label htmlFor="name">
                Name of Executor/Personal Representative
              </label>
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
          <h3>Tell Us About the Estate You Are Filing For</h3>
          <div className="blue-container">
            <div className="usa-form-group">
              <label htmlFor="secondaryName">Name of Decedent</label>
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
            <Address type="contactSecondary" />
          </div>
        </div>
      </div>
    );
  },
);
