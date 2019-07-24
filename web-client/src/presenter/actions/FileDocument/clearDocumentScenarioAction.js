import { state } from 'cerebral';

/**
 * Clears document scenario.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing scenario
 */
export const clearDocumentScenarioAction = ({ store }) => {
  store.set(state.form.scenario, null);
};
