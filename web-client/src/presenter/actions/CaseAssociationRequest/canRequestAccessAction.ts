import { state } from 'cerebral';

/**
 * invokes the path in the sequences depending on if the user can request access
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get method for getting the state.user
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @returns {object} the list of section work items
 */
export const canRequestAccessAction = ({
  applicationContext,
  get,
  path,
  props,
}: ActionProps) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const { isDirectlyAssociated } = props;
  const docketNumber = get(state.caseDetail.docketNumber);

  if (!isDirectlyAssociated) {
    let overrideForRequestAccess = false;

    if (user.role === USER_ROLES.irsPractitioner) {
      overrideForRequestAccess = true;
    }

    return path['proceed']({ overrideForRequestAccess });
  } else {
    return path['unauthorized']({ docketNumber });
  }
};
