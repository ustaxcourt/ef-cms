import { state } from 'cerebral';

/**
 * Clears secondary document scenario.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for clearing secondaryDocument.scenario
 */
export const clearSecondaryDocumentScenarioAction = ({ store }) => {
  store.unset(state.form.secondaryDocument.scenario);
};
