import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialCityOptions = connect(
  {
    trialCitiesHelper: state.trialCitiesHelper,
  },
  function TrialCityOptions({ procedureType, trialCitiesHelper }) {
    const { shouldAddStandalone, trialCitiesByState } =
      trialCitiesHelper(procedureType);
    return (
      <>
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
      </>
    );
  },
);
