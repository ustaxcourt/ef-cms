import { state } from 'cerebral';

/**
 * fixme
 * gets the form document based on the state of currentViewMetadata.documentSelectedForPreview
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get method
 * @returns {object} object containing pdfUrl
 */
export const getDocumentUrlForPreviewAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { docketNumber } = get(state.form);
  const { documentInS3 } = props;

  const {
    url,
  } = await applicationContext.getUseCases().getDocumentDownloadUrlInteractor({
    applicationContext,
    docketNumber,
    documentId: documentInS3.documentId,
  });

  return { documentId: documentInS3.documentId, pdfUrl: url };
};
