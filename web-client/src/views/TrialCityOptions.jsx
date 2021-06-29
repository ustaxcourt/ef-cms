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
        {Object.keys(trialCitiesHelper('All').trialCitiesByState).map(
          stateName => (
            <optgroup key={`TrialCityOptions-${stateName}`} label={stateName}>
              {trialCitiesHelper('All').trialCitiesByState[stateName].map(
                trialCity => (
                  <option
                    key={`TrialCityOptions-${trialCity}`}
                    value={trialCity}
                  >
                    {trialCity}
                  </option>
                ),
              )}
            </optgroup>
          ),
        )}
      </>
    );
  },
);
