import { state } from 'cerebral';

/**
 * Gets the url of the document for previewing
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @returns {object} object containing docketEntryId and pdfUrl
 */
export const getDocumentUrlForPreviewAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { docketNumber } = get(state.form);
  const { documentInS3 } = props;

  const { url } = await applicationContext
    .getUseCases()
    .getDocumentDownloadUrlInteractor(applicationContext, {
      docketNumber,
      key: documentInS3.docketEntryId,
    });

  return { docketEntryId: documentInS3.docketEntryId, pdfUrl: url };
};
