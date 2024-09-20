import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type TrialCityProps = { procedureType: string };

const trialCityDeps = { trialCitiesHelper: state.trialCitiesHelper };

export const TrialCityOptions = connect<TrialCityProps, typeof trialCityDeps>(
  trialCityDeps,
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

TrialCityOptions.displayName = 'TrialCityOptions';
