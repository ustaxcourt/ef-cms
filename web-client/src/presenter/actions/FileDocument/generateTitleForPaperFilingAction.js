import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * generate document titles for filing documents
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 */
export const generateTitleForPaperFilingAction = ({
  applicationContext,
  get,
  store,
}) => {
  const documentMetadata = cloneDeep(get(state.form));

  const { INTERNAL_DOCUMENTS_ARRAY } = applicationContext.getConstants();

  const matchingDocument = INTERNAL_DOCUMENTS_ARRAY.find(
    i => i.eventCode === documentMetadata.eventCode,
  );

  if (matchingDocument) {
    documentMetadata.documentTitle = matchingDocument.documentTitle;
  }

  let documentTitle = applicationContext
    .getUseCases()
    .generateDocumentTitleInteractor(applicationContext, {
      documentMetadata,
    });
  store.set(state.form.documentTitle, documentTitle);
};
