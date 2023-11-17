import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { InPersonProceedingForm } from './InPersonProceedingForm';
import { RemoteProceedingForm } from './RemoteProceedingForm';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';

import React from 'react';

export const LocationInformationForm = connect(
  {
    TRIAL_SESSION_PROCEEDING_TYPES:
      state.constants.TRIAL_SESSION_PROCEEDING_TYPES,
    addTrialSessionInformationHelper: state.addTrialSessionInformationHelper,
    form: state.form,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
    validateTrialSessionSequence: sequences.validateTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  function LocationInformationForm({
    addTrialSessionInformationHelper,
    form,
    TRIAL_SESSION_PROCEEDING_TYPES,
    updateTrialSessionFormDataSequence,
    validateTrialSessionSequence,
    validationErrors,
  }) {
    return (
      <>
        <h2 className="margin-top-4">
          {addTrialSessionInformationHelper.title}
        </h2>
        <div className="blue-container">
          {!addTrialSessionInformationHelper.isStandaloneSession && (
            <>
              <FormGroup errorText={validationErrors.proceedingType}>
                <fieldset
                  className="start-time usa-fieldset margin-bottom-0"
                  data-testid="trial-session-proceeding-type"
                >
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
                          data-testid={`${key}-proceeding-label`}
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
                  data-testid="trial-session-trial-location"
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
                  <TrialCityOptions procedureType="All" />
                </select>
              </FormGroup>
            </>
          )}

          {form.proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.inPerson && (
            <InPersonProceedingForm />
          )}
          {addTrialSessionInformationHelper.displayRemoteProceedingForm && (
            <RemoteProceedingForm />
          )}
        </div>
      </>
    );
  },
);

LocationInformationForm.displayName = 'LocationInformationForm';
