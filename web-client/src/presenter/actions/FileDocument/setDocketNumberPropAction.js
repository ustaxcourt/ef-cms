import { state } from 'cerebral';

/**
 * Set docket number as prop. To allow for routing.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.get the cerebral get function
 *
 * @returns {Object} the docketNumber prop
 */
export const setDocketNumberPropAction = ({ get }) => {
  const { docketNumber } = get(state.caseDetail);
  return { docketNumber };
};
