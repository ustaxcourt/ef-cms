import { findIndex, sortBy } from 'lodash';

/**
 * gets the trial cities based on procedureType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.constants
 * @param {object} applicationContext the application context
 * @returns {object} trialCitiesByState
 */
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const trialCitiesHelper =
  (get: Get, applicationContext: ClientApplicationContext): any =>
  procedureType => {
    const { TRIAL_CITIES, TRIAL_SESSION_SCOPE_TYPES } =
      applicationContext.getConstants();
    let trialCities;
    let shouldAddStandalone = false;

    switch (procedureType) {
      case 'Small':
        trialCities = TRIAL_CITIES.SMALL;
        break;
      case 'All':
        trialCities = TRIAL_CITIES.ALL;
        break;
      case 'AllPlusStandalone':
        shouldAddStandalone = true;
        trialCities = TRIAL_CITIES.ALL;
        break;
      case 'Regular': //fall-through
      default:
        trialCities = TRIAL_CITIES.REGULAR;
        break;
    }

    trialCities = sortBy(trialCities, ['state', 'city']);

    const getTrialLocationName = trialLocation =>
      `${trialLocation.city}, ${trialLocation.state}`;
    let states = [];

    const convertCityTypeFromStringToArray = trialCities.map(trialLocation =>
      trialLocation === TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
        ? trialLocation
        : { ...trialLocation, city: [getTrialLocationName(trialLocation)] },
    );

    convertCityTypeFromStringToArray.forEach(loc => {
      const foundIndexOfState = findIndex(states, { state: loc.state });
      if (foundIndexOfState < 0) {
        states.push({
          cities: [...loc.city],
          state: loc.state,
        });
      } else {
        states[foundIndexOfState] = {
          ...states[foundIndexOfState],
          cities: [...states[foundIndexOfState].cities, ...loc.city],
        };
      }
    });

    return {
      shouldAddStandalone,
      trialCitiesByState: states,
    };
  };
