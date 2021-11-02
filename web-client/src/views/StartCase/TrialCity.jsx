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
  function TrialCity({
    label,
    onChange,
    shouldAddStandalone,
    showDefaultOption,
    showHint,
    showRegularTrialCitiesHint,
    showSmallTrialCitiesHint,
    trialCitiesByState,
    validationErrors,
    value,
  }) {
    return (
      <FormGroup
        errorText={[
          validationErrors.preferredTrialCity,
          !!validationErrors.chooseAtLeastOneValue,
        ]}
      >
        <label
          className={classNames('usa-label', showHint && 'with-hint')}
          htmlFor="preferred-trial-city"
        >
          {label}
        </label>
        {showHint && (
          <span className="usa-hint">
            {showSmallTrialCitiesHint && (
              <>
                Trial locations are unavailable in the following states: DE, NH,
                NJ, RI.
              </>
            )}
            {showRegularTrialCitiesHint && (
              <>
                Trial locations are unavailable in the following states: DE, KS,
                ME, NH, NJ, ND, RI, SD, VT, WY.
              </>
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
          {shouldAddStandalone && (
            <option key="Standalone Remote" value="Standalone Remote">
              {'Standalone Remote'}
            </option>
          )}
          {trialCitiesByState.map(locationGroup => {
            return (
              <optgroup
                key={`TrialCityOptions-${locationGroup.state}`}
                label={locationGroup.state}
              >
                {locationGroup.cities.map(cityName => (
                  <option key={`TrialCityOptions-${cityName}`} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </FormGroup>
    );
  },
);
