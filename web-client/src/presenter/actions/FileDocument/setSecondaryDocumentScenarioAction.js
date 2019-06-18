import { state } from 'cerebral';

/**
 * Set secondary document scenario.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 * @returns {undefined}
 */
export const setSecondaryDocumentScenarioAction = ({ store, get }) => {
  const secondaryDocument = get(state.form.secondaryDocument);

  if (secondaryDocument && secondaryDocument.documentType) {
    const { category, documentType } = secondaryDocument;
    const CATEGORY_MAP = get(state.constants.CATEGORY_MAP);

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
