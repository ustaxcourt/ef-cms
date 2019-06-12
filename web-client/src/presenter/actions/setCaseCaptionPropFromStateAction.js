import { state } from 'cerebral';

/**
 * Sets the prop for caseCaption so that is can be used in other actions.
 * done to make it explicit that the use of case caption is wanted.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.caseCaption
 * @returns {object} case caption
 */
export const setCaseCaptionPropFromStateAction = ({ get }) => {
  const caseCaption = get(state.caseCaption);
  return { caseCaption };
};
