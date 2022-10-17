import { state } from 'cerebral';

/**
 * sets the props.barNumber from the practitioner in the state,
 * to be passed to subsequent actions
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} barNumber
 */
export const setPractitionerDocumentationPropFromStateAction = ({ get }) => {
  const barNumber = get(state.practitionerDetails.barNumber);
  return { barNumber };
};
