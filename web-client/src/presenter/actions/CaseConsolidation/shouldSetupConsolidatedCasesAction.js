import { state } from 'cerebral';

/**
 * determines the path to be taken based on helper property
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.path the cerebral path object
 * @returns {object} the next path based on if consolidated cases should be set up
 */
export const shouldSetupConsolidatedCasesAction = ({ get, path }) => {
  const setupConsolidatedCases = get(
    state.confirmInitiateServiceModalHelper.showConsolidatedCasesForService,
  );

  if (setupConsolidatedCases) {
    return path.yes();
  }

  return path.no();
};
