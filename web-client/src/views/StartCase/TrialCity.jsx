import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';

export const TrialCity = connect(
  {
    label: props.label,
    onChange: props.onChange,
    showDefaultOption: props.showDefaultOption,
    showHint: props.showHint,
    showRegularTrialCitiesHint: props.showRegularTrialCitiesHint,
    showSmallTrialCitiesHint: props.showSmallTrialCitiesHint,
    trialCitiesByState: props.trialCitiesByState,
    validationErrors: state.validationErrors,
    value: props.value,
  },
  ({
    label,
    onChange,
    showDefaultOption,
    showHint,
    showRegularTrialCitiesHint,
    showSmallTrialCitiesHint,
    trialCitiesByState,
    validationErrors,
    value,
  }) => {
    return (
      <div
        className={
          'usa-form-group ' +
          (validationErrors.preferredTrialCity ? 'usa-form-group--error' : '')
        }
      >
        <label
          className={`usa-label ${showHint ? 'with-hint' : ''}`}
          htmlFor="preferred-trial-city"
        >
          {label}
        </label>
        {showHint && (
          <span className="usa-hint">
            {showSmallTrialCitiesHint && (
              <React.Fragment>
                Trial locations are unavailable in the following states: DE, NH,
                NJ, RI. Keep in mind, your nearest location may not be in your
                state.
              </React.Fragment>
            )}
            {showRegularTrialCitiesHint && (
              <React.Fragment>
                Trial locations are unavailable in the following states: DE, KS,
                ME, NH, NJ, ND, RI, SD, VT, WY. Keep in mind, your nearest
                location may not be in your state.
              </React.Fragment>
            )}
          </span>
        )}
        <select
          className="usa-select"
          id="preferred-trial-city"
          name="preferredTrialCity"
          value={value}
          onChange={onChange}
        >
          {showDefaultOption && <option value="">-- Select --</option>}
          {Object.keys(trialCitiesByState).map((state, idx) => (
            <optgroup key={idx} label={state}>
              {trialCitiesByState[state].map((trialCity, cityIdx) => (
                <option key={cityIdx} value={trialCity}>
                  {trialCity}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    );
  },
);
