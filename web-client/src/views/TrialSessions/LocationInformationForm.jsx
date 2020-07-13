import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const LocationInformationForm = connect(
  {
    form: state.form,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
    validateTrialSessionSequence: sequences.validateTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  function LocationInformationForm({
    form,
    updateTrialSessionFormDataSequence,
    usStates,
    usStatesOther,
    validateTrialSessionSequence,
    validationErrors,
  }) {
    return (
      <>
        <h2 className="margin-top-4">Location Information</h2>
        <div className="blue-container">
          <FormGroup errorText={validationErrors.trialLocation}>
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
          </FormGroup>

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
              Address line 1 <span className="usa-hint">(optional)</span>
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
                    {Object.keys(usStates).map(abbrev => {
                      return (
                        <option key={abbrev} value={abbrev}>
                          {usStates[abbrev]}
                        </option>
                      );
                    })}
                  </optgroup>
                  <optgroup label="Other">
                    {usStatesOther.map(abbrev => {
                      return (
                        <option key={abbrev} value={abbrev}>
                          {abbrev}
                        </option>
                      );
                    })}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
          <FormGroup errorText={validationErrors.postalCode}>
            <label aria-hidden className="usa-label" htmlFor="postal-code">
              ZIP code <span className="usa-hint">(optional)</span>
            </label>
            <input
              aria-label="zip code"
              autoCapitalize="none"
              className="usa-input max-width-200 usa-input--medium"
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
          </FormGroup>
        </div>
      </>
    );
  },
);
