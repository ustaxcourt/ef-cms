import { state } from 'cerebral';

/**
 * determines the path to be taken based on form data
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.applicationContext the applicationContext object
 * @param {object} providers.path the cerebral path object
 * @returns {object} the next path based on if the event code can be multi-docketed
 */
export const shouldSetupConsolidatedCasesAction = ({ get, path }) => {
  let setupConsolidatedCases = get(
    state.confirmInitiateServiceModalHelper.showConsolidatedCasesForService,
  );

  if (setupConsolidatedCases) {
    return path.yes();
  }

  return path.no();
};
