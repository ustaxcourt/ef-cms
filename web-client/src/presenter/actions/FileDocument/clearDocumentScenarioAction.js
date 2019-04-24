import { state } from 'cerebral';

/**
 * Clears document scenario.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object used for clearing scenario
 */
export const clearDocumentScenarioAction = ({ store }) => {
  store.set(state.form.scenario, null);
};
