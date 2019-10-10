import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialCityOptions = connect(
  {
    trialCitiesHelper: state.trialCitiesHelper,
  },
  ({ trialCitiesHelper }) => {
    return (
      <>
        {Object.keys(trialCitiesHelper('All').trialCitiesByState).map(
          (state, idx) => (
            <optgroup key={idx} label={state}>
              {trialCitiesHelper('All').trialCitiesByState[state].map(
                (trialCity, cityIdx) => (
                  <option key={cityIdx} value={trialCity}>
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
