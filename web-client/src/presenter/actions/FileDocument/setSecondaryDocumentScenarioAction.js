import { state } from 'cerebral';

/**
 * Set secondary document scenario.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store object
 * @returns {undefined}
 */
export const setSecondaryDocumentScenarioAction = ({
  applicationContext,
  get,
  store,
}) => {
  const secondaryDocument = get(state.form.secondaryDocument);

  if (secondaryDocument && secondaryDocument.documentType) {
    const { category, documentType } = secondaryDocument;
    const { CATEGORY_MAP } = applicationContext.getConstants();

    const categoryInformation = CATEGORY_MAP[category].find(
      itemDocumentType => itemDocumentType.documentType === documentType,
    );

    store.set(
      state.form.secondaryDocument.scenario,
      categoryInformation.scenario,
    );
    store.set(
      state.form.secondaryDocument.documentTitle,
      categoryInformation.documentTitle,
    );
    store.set(
      state.form.secondaryDocument.eventCode,
      categoryInformation.eventCode,
    );
  }
};
