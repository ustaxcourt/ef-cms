import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const LocationInformationForm = connect(
  {
    form: state.form,
    trialCitiesHelper: state.trialCitiesHelper,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
    validateTrialSessionSequence: sequences.validateTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    trialCitiesHelper,
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
            <label htmlFor="trial-location" className="usa-label">
              Trial Location
            </label>
            <select
              name="trialLocation"
              id="trial-location"
              className="usa-select"
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value || null,
                });
                validateTrialSessionSequence();
              }}
              value={form.trialLocation}
            >
              <option value="">-- Select --</option>
              {Object.keys(trialCitiesHelper('All').trialCitiesByState).map(
                (state, idx) => (
                  <optgroup key={idx} label={state}>
                    {trialCitiesHelper('All').trialCitiesByState[state].map(
                      (trialCity, cityIdx) => (
                        <option key={cityIdx} value={trialCity}>
                          {trialCity}
                        </option>
                      ),
                    )}
                  </optgroup>
                ),
              )}
            </select>
            <Text
              className="usa-error-message"
              bind="validationErrors.trialLocation"
            />
          </div>

          <div className="usa-form-group">
            <label htmlFor="courthouse-name" className="usa-label">
              Courthouse Name <span className="usa-hint">(optional)</span>
            </label>
            <input
              id="courthouse-name"
              type="text"
              name="courthouseName"
              className="usa-input"
              autoCapitalize="none"
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
            <label htmlFor="address1" className="usa-label">
              Address Line 1 <span className="usa-hint">(optional)</span>
            </label>
            <input
              id="address1"
              type="text"
              name="address1"
              className="usa-input"
              autoCapitalize="none"
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
            <label htmlFor="address2" className="usa-label">
              Address Line 2 <span className="usa-hint">(optional)</span>
            </label>
            <input
              id="address2"
              type="text"
              name="address2"
              className="usa-input"
              autoCapitalize="none"
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
                <label htmlFor="city" className="usa-label">
                  City <span className="usa-hint">(optional)</span>
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  className="usa-input usa-input--inline"
                  autoCapitalize="none"
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
                <label htmlFor="state" className="usa-label">
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
              htmlFor="postal-code"
              className="usa-label"
              aria-label="zip code"
            >
              ZIP Code <span className="usa-hint">(optional)</span>
            </label>
            <input
              id="postal-code"
              type="text"
              name="postalCode"
              className="usa-input usa-input--medium"
              autoCapitalize="none"
              value={form.postalCode || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                validateTrialSessionSequence();
              }}
            />
            <Text
              className="usa-error-message"
              bind="validationErrors.postalCode"
            />
          </div>
        </div>
      </>
    );
  },
);
