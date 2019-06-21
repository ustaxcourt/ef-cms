import { state } from 'cerebral';

/**
 * invokes the path in the sequeneces depending on if the user can request access
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method for getting the state.user
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @returns {object} the list of section work items
 */
export const canRequestAccessAction = ({ get, props, path }) => {
  const isAssociated = props.isAssociated;
  const caseId = get(state.caseDetail.caseId);
  if (!isAssociated) {
    return path['proceed']();
  } else {
    return path['unauthorized']({ caseId });
  }
};
