import { state } from 'cerebral';

/**
 * Refresh External Document Title From Event Code
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.store the cerebral store
 */
export const refreshExternalDocumentTitleFromEventCodeAction = ({
  applicationContext,
  get,
  store,
}) => {
  const { category, eventCode } = get(state.form);
  const { CATEGORY_MAP } = applicationContext.getConstants();

  if (category && eventCode) {
    const categoryInformation = CATEGORY_MAP[category].find(
      itemDocumentType => itemDocumentType.eventCode === eventCode,
    );

    store.set(state.form.documentTitle, categoryInformation.documentTitle);
  }

  const secondaryDocument = get(state.form.secondaryDocument);
  if (
    secondaryDocument &&
    secondaryDocument.category &&
    secondaryDocument.eventCode
  ) {
    const categoryInformation = CATEGORY_MAP[secondaryDocument.category].find(
      itemDocumentType =>
        itemDocumentType.eventCode === secondaryDocument.eventCode,
    );

    store.set(
      state.form.secondaryDocument.documentTitle,
      categoryInformation.documentTitle,
    );
  }
};
