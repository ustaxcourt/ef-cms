import { state } from 'cerebral';

/**
 * Set document scenario.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @returns {undefined}
 */
export const setDocumentScenarioAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { category, documentType } = get(state.form);
  const { CATEGORY_MAP } = applicationContext.getConstants();

  const categoryInformation = CATEGORY_MAP[category].find(
    itemDocumentType => itemDocumentType.documentType === documentType,
  );

  store.set(state.form.scenario, categoryInformation.scenario);
  store.set(state.form.documentTitle, categoryInformation.documentTitle);
  store.set(state.form.eventCode, categoryInformation.eventCode);
};
