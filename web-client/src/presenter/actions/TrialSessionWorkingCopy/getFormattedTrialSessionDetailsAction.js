import { state } from 'cerebral';

/**
 * getFormattedTrialSessionDetailsAction
 *
 * @param {object} providers.get the cerebral get function
 * @returns {Object} formattedTrialSessionDetails
 */

export const getFormattedTrialSessionDetailsAction = ({ get }) => {
  const formattedTrialSessionDetails = get(state.formattedTrialSessionDetails);
  return { formattedTrialSessionDetails };
};
