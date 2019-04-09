import { state } from 'cerebral';

/**
 * Set document scenario.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object
 * @param {Object} providers.get the cerebral get function
 */
export const setDocumentScenarioAction = ({ store, get }) => {
  const { category, documentType } = get(state.form);
  const CATEGORY_MAP = get(state.constants.CATEGORY_MAP);

  const categoryInformation = CATEGORY_MAP[category].find(
    itemDocumentType => itemDocumentType.documentType === documentType,
  );

  store.set(state.form.scenario, categoryInformation.scenario);
  store.set(state.form.documentTitle, categoryInformation.documentTitle);
};
