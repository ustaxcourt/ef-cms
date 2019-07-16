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

  const supportingDocuments = get(state.form.supportingDocuments);

  if (supportingDocuments) {
    for (let i=0; i<supportingDocuments.length; i++) {
      const supportingDocumentMetadata = supportingDocuments[i].supportingDocumentMetadata;
      if (supportingDocumentMetadata) {
        const { category, documentType } = supportingDocumentMetadata;
    
        const categoryInformation = CATEGORY_MAP[category].find(
          itemDocumentType => itemDocumentType.documentType === documentType,
        );
    
        store.set(
          state.form.supportingDocuments[i].supportingDocumentMetadata.scenario,
          categoryInformation.scenario,
        );
        store.set(
          state.form.supportingDocuments[i].supportingDocumentMetadata.documentTitle,
          categoryInformation.documentTitle,
        );
        store.set(
          state.form.supportingDocuments[i].supportingDocumentMetadata.eventCode,
          categoryInformation.eventCode,
        );
      }
    }
  }

  const secondarySupportingDocuments = get(state.form.secondarySupportingDocuments);

  if (secondarySupportingDocuments) {
    for (let i=0; i<secondarySupportingDocuments.length; i++) {
      const secondarySupportingDocumentMetadata = secondarySupportingDocuments[i].secondarySupportingDocumentMetadata;
      if (secondarySupportingDocumentMetadata) {
        const { category, documentType } = secondarySupportingDocumentMetadata;
    
        const categoryInformation = CATEGORY_MAP[category].find(
          itemDocumentType => itemDocumentType.documentType === documentType,
        );
    
        store.set(
          state.form.secondarySupportingDocuments[i].secondarySupportingDocumentMetadata.scenario,
          categoryInformation.scenario,
        );
        store.set(
          state.form.secondarySupportingDocuments[i].secondarySupportingDocumentMetadata.documentTitle,
          categoryInformation.documentTitle,
        );
        store.set(
          state.form.secondarySupportingDocuments[i].secondarySupportingDocumentMetadata.eventCode,
          categoryInformation.eventCode,
        );
      }
    }
  }
};
