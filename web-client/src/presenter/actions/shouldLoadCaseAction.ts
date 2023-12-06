import { state } from '@web-client/presenter/app.cerebral';

/**
 * Used for checking the current caseDetail and reloading if necessary.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @param {object} providers.props the cerebral props object
 * @returns {*} returns the next action in the sequence's path
 */
export const shouldLoadCaseAction = ({ get, path, props }: ActionProps) => {
  // we might be in a wizard, looking at state, or we may need to fetch the case
  if (get(state.caseDetail.docketNumber) === props.docketNumber) {
    return path.ignore();
  }

  return path.load();
};
