import { US_STATES } from '../entities/EntityConstants';
import { invert } from 'lodash';

/**
 * abbreviates the state given a string with a comma separated city and state
 *
 * @param {string} locationString the location string to format
 * @returns {string} a formatted string with the abbreviated state
 */
export const abbreviateState = locationString => {
  const cityAndState = locationString.split(', ');
  const stateAbbreviation = invert(US_STATES)[cityAndState[1]];
  const formattedCityAndState = `${cityAndState[0]}, ${stateAbbreviation}`;

  return formattedCityAndState;
};
