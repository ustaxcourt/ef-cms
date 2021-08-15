import { state } from 'cerebral';

/**
 * check if both the current case is a consolidated case and the user has the
 * permission for filing documents in consolidated cases, returning the appropriate path
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the paths for next execution
 * @returns {object} the path to execute next
 */
export const canFileInConsolidatedCasesAction = ({ get, path }) => {
  const permissions = get(state.permissions);
  const hasPermission = permissions.FILE_IN_CONSOLIDATED;
  const leadDocketNumber = get(state.caseDetail.leadDocketNumber);

  if (leadDocketNumber && hasPermission) {
    return path.yes();
  } else {
    return path.no();
  }
};
