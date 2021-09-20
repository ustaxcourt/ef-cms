import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InPersonProceedingForm } from './InPersonProceedingForm';
import { RemoteProceedingForm } from './RemoteProceedingForm';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';

import React from 'react';

export const LocationInformationForm = connect(
  {
    TRIAL_SESSION_PROCEEDING_TYPES:
      state.constants.TRIAL_SESSION_PROCEEDING_TYPES,
    form: state.form,
    trialSessionInformationHelper: state.trialSessionInformationHelper,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
    validateTrialSessionSequence: sequences.validateTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  function LocationInformationForm({
    form,
    TRIAL_SESSION_PROCEEDING_TYPES,
    trialSessionInformationHelper,
    updateTrialSessionFormDataSequence,
    validateTrialSessionSequence,
    validationErrors,
  }) {
    return (
      <>
        <h2 className="margin-top-4">Location Information</h2>
        <div className="blue-container">
          <FormGroup errorText={validationErrors.proceedingType}>
            <fieldset className="start-time usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="proceeding-type-legend">
                Proceeding type
              </legend>
              {Object.entries(TRIAL_SESSION_PROCEEDING_TYPES).map(
                ([key, value]) => (
                  <div className="usa-radio usa-radio__inline" key={key}>
                    <input
                      aria-describedby="proceeding-type-legend"
                      checked={form.proceedingType === value}
                      className="usa-radio__input"
                      id={`${key}-proceeding`}
                      name="proceedingType"
                      type="radio"
                      value={value}
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
                    <label
                      aria-label={value}
                      className="smaller-padding-right usa-radio__label"
                      htmlFor={`${key}-proceeding`}
                      id={`${key}-proceeding-label`}
                    >
                      {value}
                    </label>
                  </div>
                ),
              )}
            </fieldset>
          </FormGroup>

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

          {form.proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.inPerson && (
            <InPersonProceedingForm />
          )}
          {form.proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.remote && (
            <RemoteProceedingForm />
          )}
        </div>
      </>
    );
  },
);
