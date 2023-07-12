import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the props.barNumber from the practitioner in the state,
 * to be passed to subsequent actions
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} barNumber
 */
export const setPractitionerDocumentationPropFromStateAction = ({
  get,
}: ActionProps) => {
  const barNumber = get(state.practitionerDetail.barNumber);
  return { barNumber };
};
