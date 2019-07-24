import { state } from 'cerebral';

/**
 * Set document scenario.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.get the cerebral get function
 * @returns {undefined}
 */
export const setSupportingDocumentScenarioAction = ({ get, store }) => {
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
    store.set(
      state.form.supportingDocumentMetadata.eventCode,
      categoryInformation.eventCode,
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
    store.set(
      state.form.secondarySupportingDocumentMetadata.eventCode,
      secondaryCategoryInformation.eventCode,
    );
  }
};
