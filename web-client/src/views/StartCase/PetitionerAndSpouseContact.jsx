import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export default connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function PetitionerAndSpouseContact({ form, updateFormValueSequence }) {
    return (
      <div>
        <div className="usa-form-group">
          <h3>Tell Us About Yourself</h3>
          <div className="blue-container">
            <div className="usa-form-group">
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
              />
            </div>
            <div className="usa-form-group">
              <label htmlFor="address1">Street Address</label>
              <input
                id="address1"
                type="text"
                name="contactPrimary.address1"
                autoCapitalize="none"
                value={form.contactPrimary.address1 || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
            <div className="usa-form-group">
              <label htmlFor="address2">
                Suite/Apt # <span className="usa-form-hint">(optional)</span>
              </label>
              <input
                id="address2"
                type="text"
                name="contactPrimary.address2"
                autoCapitalize="none"
                value={form.contactPrimary.address2 || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
            <div className="usa-form-group">
              <fieldset>
                <div className="ustc-form-group-city">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    type="text"
                    name="contactPrimary.city"
                    className="usa-input-inline"
                    autoCapitalize="none"
                    value={form.contactPrimary.city || ''}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="ustc-form-group-state">
                  <label htmlFor="state">State</label>
                  <select
                    className="usa-input-inline"
                    id="state"
                    name="contactPrimary.state"
                    value={form.contactPrimary.state || ''}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  >
                    <option>- Select -</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                    <option value="AA">AA - Armed Forces Americas</option>
                    <option value="AE">AE - Armed Forces Africa</option>
                    <option value="AE">AE - Armed Forces Canada</option>
                    <option value="AE">AE - Armed Forces Europe</option>
                    <option value="AE">AE - Armed Forces Middle East</option>
                    <option value="AP">AP - Armed Forces Pacific</option>
                  </select>
                </div>
              </fieldset>
            </div>
            <div className="usa-form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input
                id="zip"
                type="text"
                name="contactPrimary.zip"
                className="usa-input-medium"
                autoCapitalize="none"
                value={form.contactPrimary.zip || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
            <div className="usa-form-group">
              <label htmlFor="email">Email Address</label>
              {form.contactPrimary.email}
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
          <h3>Tell Us About Your Spouse</h3>
          <div className="blue-container">
            <div className="usa-form-group">
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
              />
            </div>
            <div className="usa-form-group">
              <label htmlFor="secondaryAddress1">Street Address</label>
              <input
                id="secondaryAddress1"
                type="text"
                name="contactSecondary.address1"
                autoCapitalize="none"
                value={form.contactSecondary.address1 || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
            <div className="usa-form-group">
              <label htmlFor="secondaryAddress2">
                Suite/Apt # <span className="usa-form-hint">(optional)</span>
              </label>
              <input
                id="secondaryAddress2"
                type="text"
                name="contactSecondary.address2"
                autoCapitalize="none"
                value={form.contactSecondary.address2 || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
            <div className="usa-form-group">
              <fieldset>
                <div className="ustc-form-group-city">
                  <label htmlFor="secondaryCity">City</label>
                  <input
                    id="secondaryCity"
                    type="text"
                    name="contactSecondary.city"
                    className="usa-input-inline"
                    autoCapitalize="none"
                    value={form.contactSecondary.city || ''}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="ustc-form-group-state">
                  <label htmlFor="secondaryState">State</label>
                  <select
                    className="usa-input-inline"
                    id="secondaryState"
                    name="contactSecondary.state"
                    value={form.contactSecondary.state || ''}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  >
                    <option>- Select -</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                    <option value="AA">AA - Armed Forces Americas</option>
                    <option value="AE">AE - Armed Forces Africa</option>
                    <option value="AE">AE - Armed Forces Canada</option>
                    <option value="AE">AE - Armed Forces Europe</option>
                    <option value="AE">AE - Armed Forces Middle East</option>
                    <option value="AP">AP - Armed Forces Pacific</option>
                  </select>
                </div>
              </fieldset>
            </div>
            <div className="usa-form-group">
              <label htmlFor="secondaryZip">ZIP Code</label>
              <input
                id="secondaryZip"
                type="text"
                name="contactSecondary.zip"
                className="usa-input-medium"
                autoCapitalize="none"
                value={form.contactSecondary.zip || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
            <div className="usa-form-group">
              <label htmlFor="secondaryEmail">Email Address</label>
              <input
                id="secondaryEmail"
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
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);
