import { state } from 'cerebral';

/**
 * Set secondary document scenario.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object
 * @param {Object} providers.get the cerebral get function
 */
export const setSecondaryDocumentScenarioAction = ({ store, get }) => {
  const secondaryDocument = get(state.form.secondaryDocument);

  if (secondaryDocument) {
    const { category, documentType } = secondaryDocument;
    const CATEGORY_MAP = get(state.constants.CATEGORY_MAP);

    const categoryInformation = CATEGORY_MAP[category].find(
      itemDocumentType => itemDocumentType.documentType === documentType,
    );

    store.set(
      state.form.secondaryDocument.scenario,
      categoryInformation.scenario,
    );
  }
};
