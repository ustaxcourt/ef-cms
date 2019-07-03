import { state } from 'cerebral';

/**
 * Set document scenario.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 * @returns {undefined}
 */
export const setDocumentScenarioAction = ({ get, store }) => {
  const { category, documentType } = get(state.form);
  const CATEGORY_MAP = get(state.constants.CATEGORY_MAP);

  const categoryInformation = CATEGORY_MAP[category].find(
    itemDocumentType => itemDocumentType.documentType === documentType,
  );

  store.set(state.form.scenario, categoryInformation.scenario);
  store.set(state.form.documentTitle, categoryInformation.documentTitle);
  store.set(state.form.eventCode, categoryInformation.eventCode);
};
