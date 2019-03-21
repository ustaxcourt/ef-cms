import { state } from 'cerebral';
import _ from 'lodash';

/**
 * Sets the prop for caseCaption so that is can be used in other actions.
 * done to make it explicit that the use of case caption is wanted.
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.caseCaption
 */
export const setCaseCaptionPropFromStateAction = async ({ get }) => {
  const caseCaption = get(state.caseCaption);
  return { caseCaption };
};
