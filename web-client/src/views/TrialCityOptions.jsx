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
          (stateName, idx) => (
            <optgroup
              key={`TrialCityOptions-${stateName}-${idx}`}
              label={stateName}
            >
              {trialCitiesHelper('All').trialCitiesByState[stateName].map(
                (trialCity, cityIdx) => (
                  <option
                    key={`TrialCityOptions-${trialCity}-${cityIdx}`}
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
