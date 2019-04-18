import { state } from 'cerebral';

/**
 * Clears secondary document scenario.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing secondaryDocument.scenario
 */
export const clearSecondaryDocumentScenarioAction = ({ store }) => {
  store.set(state.form.secondaryDocument.scenario, null);
};
