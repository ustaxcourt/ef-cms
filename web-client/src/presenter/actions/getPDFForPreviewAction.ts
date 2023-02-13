import { state } from 'cerebral';

/**
 * given a docketNumber and docketEntryId, fetch a PDF from S3 and put into props stream.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props used for getting docketNumber and docketEntryId
 * @param {object} providers.store the cerebral store
 * @returns {Promise<object>} pdf file object for preview
 */
export const getPDFForPreviewAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  store.set(state.modal.pdfPreviewModal, {});
  if (props.file.name) {
    return props;
  }
  const { docketEntryId } = props.file;
  const docketNumber = get(state.caseDetail.docketNumber);

  const pdfObj = await applicationContext
    .getUseCases()
    .loadPDFForPreviewInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });
  return { file: pdfObj };
};
