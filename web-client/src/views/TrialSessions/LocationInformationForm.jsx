import { TrialCityOptions } from '../TrialCityOptions';
import { ValidationText } from '../../ustc-ui/Text/ValidationText';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const LocationInformationForm = connect(
  {
    form: state.form,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
    validateTrialSessionSequence: sequences.validateTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    updateTrialSessionFormDataSequence,
    validateTrialSessionSequence,
    validationErrors,
  }) => {
    return (
      <>
        <h2 className="margin-top-4">Location Information</h2>
        <div className="blue-container">
          <div
            className={`usa-form-group ${
              validationErrors.trialLocation ? 'usa-form-group--error' : ''
            }`}
          >
            <label className="usa-label" htmlFor="trial-location">
              Trial location
            </label>
            <select
              className="usa-select"
              id="trial-location"
              name="trialLocation"
              value={form.trialLocation}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value || null,
                });
                validateTrialSessionSequence();
              }}
            >
              <option value="">-- Select --</option>
              <TrialCityOptions />
            </select>
            <ValidationText field="trialLocation" />
          </div>

          <div className="usa-form-group">
            <label className="usa-label" htmlFor="courthouse-name">
              Courthouse name <span className="usa-hint">(optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id="courthouse-name"
              name="courthouseName"
              type="text"
              value={form.courthouseName || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>

          <div className="usa-form-group">
            <label className="usa-label" htmlFor="address1">
              Address Line 1 <span className="usa-hint">(optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id="address1"
              name="address1"
              type="text"
              value={form.address1 || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>

          <div className="usa-form-group">
            <label className="usa-label" htmlFor="address2">
              Address line 2 <span className="usa-hint">(optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id="address2"
              name="address2"
              type="text"
              value={form.address2 || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>

          <div className="usa-form-group">
            <div className="grid-row grid-gap state-and-city">
              <div className="grid-col-8">
                <label className="usa-label" htmlFor="city">
                  City <span className="usa-hint">(optional)</span>
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input usa-input--inline"
                  id="city"
                  name="city"
                  type="text"
                  value={form.city || ''}
                  onChange={e => {
                    updateTrialSessionFormDataSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="grid-col-4">
                <label className="usa-label" htmlFor="state">
                  State <span className="usa-hint">(optional)</span>
                </label>
                <select
                  className="usa-select"
                  id="state"
                  name="state"
                  value={form.state || ''}
                  onChange={e => {
                    updateTrialSessionFormDataSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                >
                  <option value="">- Select -</option>
                  <optgroup label="State">
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
                  </optgroup>
                  <optgroup label="Other">
                    <option value="AA">AA</option>
                    <option value="AE">AE</option>
                    <option value="AP">AP</option>
                    <option value="AS">AS</option>
                    <option value="FM">FM</option>
                    <option value="GU">GU</option>
                    <option value="MH">MH</option>
                    <option value="MP">MP</option>
                    <option value="PW">PW</option>
                    <option value="PR">PR</option>
                    <option value="VI">VI</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          <div
            className={`usa-form-group margin-bottom-0 ${
              validationErrors.postalCode ? 'usa-form-group--error' : ''
            }`}
          >
            <label
              aria-label="zip code"
              className="usa-label"
              htmlFor="postal-code"
            >
              ZIP code <span className="usa-hint">(optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input usa-input--medium"
              id="postal-code"
              name="postalCode"
              type="text"
              value={form.postalCode || ''}
              onBlur={() => {
                validateTrialSessionSequence();
              }}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <ValidationText field="postalCode" />
          </div>
        </div>
      </>
    );
  },
);
