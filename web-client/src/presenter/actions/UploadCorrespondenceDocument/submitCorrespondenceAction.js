import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * sets the correspondence document onto the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitCorrespondenceAction = async ({
  applicationContext,
  get,
  props,
}) => {
  let caseDetail;
  const { caseId, docketNumber } = get(state.caseDetail);
  const { primaryDocumentFileId: documentId } = props;
  const formData = get(state.form);
  const { documentIdToEdit } = formData;

  let documentMetadata = omit(formData, [
    'primaryDocumentFile',
    'documentIdToEdit',
  ]);

  documentMetadata = {
    ...documentMetadata,
    caseId,
    docketNumber,
  };

  documentMetadata.draftState = { ...documentMetadata };

  await applicationContext.getUseCases().virusScanPdfInteractor({
    applicationContext,
    documentId,
  });

  await applicationContext.getUseCases().validatePdfInteractor({
    applicationContext,
    documentId,
  });

  if (documentIdToEdit) {
    caseDetail = await applicationContext
      .getUseCases()
      .updateCorrespondenceDocumentInteractor({
        applicationContext,
        documentIdToEdit,
        documentMetadata,
      });
  } else {
    caseDetail = await applicationContext
      .getUseCases()
      .addCorrespondenceDocumentInteractor({
        applicationContext,
        documentMetadata,
        primaryDocumentFileId: documentId,
      });
  }

  return {
    caseDetail,
    caseId: docketNumber,
    documentId,
  };
};
