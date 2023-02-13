import { state } from 'cerebral';

/**
 * invokes the path in the sequences depending on if the user can request access
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method for getting the state.user
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @returns {object} the list of section work items
 */
export const canRequestAccessAction = ({ get, path, props }) => {
  const { isAssociated } = props;
  const docketNumber = get(state.caseDetail.docketNumber);
  if (!isAssociated) {
    return path['proceed']();
  } else {
    return path['unauthorized']({ docketNumber });
  }
};
