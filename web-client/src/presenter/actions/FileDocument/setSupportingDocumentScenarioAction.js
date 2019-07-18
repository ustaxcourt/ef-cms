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
    for (let i = 0; i < supportingDocuments.length; i++) {
      if (
        supportingDocuments[i] &&
        supportingDocuments[i].category &&
        supportingDocuments[i].documentType
      ) {
        const { category, documentType } = supportingDocuments[i];

        const categoryInformation = CATEGORY_MAP[category].find(
          itemDocumentType => itemDocumentType.documentType === documentType,
        );

        store.set(
          state.form.supportingDocuments[i].scenario,
          categoryInformation.scenario,
        );
        store.set(
          state.form.supportingDocuments[i].documentTitle,
          categoryInformation.documentTitle,
        );
        store.set(
          state.form.supportingDocuments[i].eventCode,
          categoryInformation.eventCode,
        );
      }
    }
  }

  const secondarySupportingDocuments = get(
    state.form.secondarySupportingDocuments,
  );

  if (secondarySupportingDocuments) {
    for (let i = 0; i < secondarySupportingDocuments.length; i++) {
      if (
        secondarySupportingDocuments[i] &&
        secondarySupportingDocuments[i].category &&
        secondarySupportingDocuments[i].documentType
      ) {
        const { category, documentType } = secondarySupportingDocuments[i];

        const categoryInformation = CATEGORY_MAP[category].find(
          itemDocumentType => itemDocumentType.documentType === documentType,
        );

        store.set(
          state.form.secondarySupportingDocuments[i].scenario,
          categoryInformation.scenario,
        );
        store.set(
          state.form.secondarySupportingDocuments[i].documentTitle,
          categoryInformation.documentTitle,
        );
        store.set(
          state.form.secondarySupportingDocuments[i].eventCode,
          categoryInformation.eventCode,
        );
      }
    }
  }
};
