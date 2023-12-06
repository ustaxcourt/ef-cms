import { state } from '@web-client/presenter/app.cerebral';

/**
 * invokes the path in the sequences depending on if the user can request access
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method for getting the state.user
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @returns {object} the list of section work items
 */
export const canRequestAccessAction = ({ get, path, props }: ActionProps) => {
  const { isDirectlyAssociated } = props;
  const docketNumber = get(state.caseDetail.docketNumber);

  if (!isDirectlyAssociated) {
    return path['proceed']({ isRequestingAccess: true });
  } else {
    return path['unauthorized']({ docketNumber });
  }
};
