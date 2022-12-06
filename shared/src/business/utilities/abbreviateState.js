import { invert } from 'lodash';
import { US_STATES } from '../entities/EntityConstants';

/**
 * abbreviates the state given a string with a comma separated city and state
 *
 * @param {string} locationString the location string to format
 * @returns {string} a formatted string with the abbreviated state
 */
const abbreviateState = locationString => {
  const cityAndState = locationString.split(', ');
  const stateAbbreviation = invert(US_STATES)[cityAndState[1]];
  const formattedCityAndState = `${cityAndState[0]}, ${stateAbbreviation}`;

  return formattedCityAndState;
};

module.exports = {
  abbreviateState,
};
