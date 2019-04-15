import { state } from 'cerebral';

/**
 * Set document scenario.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store object
 * @param {Object} providers.get the cerebral get function
 */
export const setSupportingDocumentScenarioAction = ({ store, get }) => {
  const CATEGORY_MAP = get(state.constants.CATEGORY_MAP);

  const supportingDocumentMetadata = get(state.form.supportingDocumentMetadata);
  if (supportingDocumentMetadata) {
    const { category, documentType } = supportingDocumentMetadata;

    const categoryInformation = CATEGORY_MAP[category].find(
      itemDocumentType => itemDocumentType.documentType === documentType,
    );

    store.set(
      state.form.supportingDocumentMetadata.scenario,
      categoryInformation.scenario,
    );
    store.set(
      state.form.supportingDocumentMetadata.documentTitle,
      categoryInformation.documentTitle,
    );
  }

  const secondarySupportingDocumentMetadata = get(
    state.form.secondarySupportingDocumentMetadata,
  );
  if (secondarySupportingDocumentMetadata) {
    const { category, documentType } = secondarySupportingDocumentMetadata;

    const secondaryCategoryInformation = CATEGORY_MAP[category].find(
      itemDocumentType => itemDocumentType.documentType === documentType,
    );

    store.set(
      state.form.secondarySupportingDocumentMetadata.scenario,
      secondaryCategoryInformation.scenario,
    );
    store.set(
      state.form.secondarySupportingDocumentMetadata.documentTitle,
      secondaryCategoryInformation.documentTitle,
    );
  }
};
