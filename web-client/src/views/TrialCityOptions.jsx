import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialCityOptions = connect(
  {
    trialCitiesHelper: state.trialCitiesHelper,
  },
  function TrialCityOptions({ trialCitiesHelper }) {
    return (
      <>
        {trialCitiesHelper('All').trialCitiesByState.map(locationGroup => {
          if (locationGroup.state) {
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
          } else {
            return (
              <option
                key={`TrialCityOptions-${locationGroup}`}
                value={locationGroup}
              >
                {locationGroup}
              </option>
            );
          }
        })}
      </>
    );
  },
);
