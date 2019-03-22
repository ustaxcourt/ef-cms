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
    value,
    label,
    showHint,
    onChange,
    showSmallTrialCitiesHint,
    showRegularTrialCitiesHint,
    validationErrors,
    trialCitiesByState,
    showDefaultOption,
  }) => {
    return (
      <div
        className={
          'usa-form-group ' +
          (validationErrors.preferredTrialCity ? 'usa-input-error' : '')
        }
      >
        <label htmlFor="preferred-trial-city" className="with-hint">
          {label}
        </label>
        {showHint && (
          <span className="usa-form-hint">
            {showSmallTrialCitiesHint && (
              <React.Fragment>
                Trial locations are unavailable in the following states: DE, NH,
                NJ, RI. Please select the next closest location.
              </React.Fragment>
            )}
            {showRegularTrialCitiesHint && (
              <React.Fragment>
                Trial locations are unavailable in the following states: DE, KS,
                ME, NH, NJ, ND, RI, SD, VT, WY. Please select the next closest
                location.
              </React.Fragment>
            )}
          </span>
        )}
        <select
          name="preferredTrialCity"
          id="preferred-trial-city"
          onChange={onChange}
          value={value}
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
