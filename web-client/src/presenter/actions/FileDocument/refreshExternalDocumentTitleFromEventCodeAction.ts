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
  const {
    CATEGORY_MAP,
    INTERNAL_CATEGORY_MAP,
    PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP,
  } = applicationContext.getConstants();

  const eventCodeMatches = docketEntry => docketEntry.eventCode === eventCode;

  const isPractitionerAssociationDocument =
    PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP.find(eventCodeMatches);

  if (category && eventCode && !isPractitionerAssociationDocument) {
    const internalAndExternalFilingEventForCategory = [
      ...CATEGORY_MAP[category],
      ...INTERNAL_CATEGORY_MAP[category],
    ];

    const categoryInformation =
      internalAndExternalFilingEventForCategory.find(eventCodeMatches);
    store.set(state.form.documentTitle, categoryInformation.documentTitle);
  }

  const secondaryDocument = get(state.form.secondaryDocument);
  if (
    secondaryDocument &&
    secondaryDocument.category &&
    secondaryDocument.eventCode
  ) {
    const internalAndExternalFilingEventForCategory = [
      ...CATEGORY_MAP[secondaryDocument.category],
      ...INTERNAL_CATEGORY_MAP[secondaryDocument.category],
    ];

    const categoryInformation = internalAndExternalFilingEventForCategory.find(
      docketEntry => docketEntry.eventCode === secondaryDocument.eventCode,
    );

    store.set(
      state.form.secondaryDocument.documentTitle,
      categoryInformation.documentTitle,
    );
  }
};
