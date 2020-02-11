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

  const categoryInformation = CATEGORY_MAP[category].find(
    itemDocumentType => itemDocumentType.eventCode === eventCode,
  );

  store.set(state.form.documentTitle, categoryInformation.documentTitle);
};
