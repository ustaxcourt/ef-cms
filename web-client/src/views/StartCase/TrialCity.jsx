import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

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
      <FormGroup errorText={validationErrors.preferredTrialCity}>
        <label
          className={classNames('usa-label', showHint && 'with-hint')}
          htmlFor="preferred-trial-city"
        >
          {label}
        </label>
        {showHint && (
          <span className="usa-hint">
            {showSmallTrialCitiesHint && (
              <React.Fragment>
                Trial locations are unavailable in the following states: DE, NH,
                NJ, RI.
              </React.Fragment>
            )}
            {showRegularTrialCitiesHint && (
              <React.Fragment>
                Trial locations are unavailable in the following states: DE, KS,
                ME, NH, NJ, ND, RI, SD, VT, WY.
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
      </FormGroup>
    );
  },
);
