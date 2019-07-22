import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * sets the court issued order onto the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitCourtIssuedOrderAction = async ({
  applicationContext,
  get,
  props,
}) => {
  let caseDetail;
  const { caseId, docketNumber } = get(state.caseDetail);
  const { primaryDocumentFileId } = props;
  const documentId = primaryDocumentFileId;

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    docketNumber,
    caseId,
  };

  if (primaryDocumentFileId) {
    await applicationContext.getUseCases().virusScanPdfInteractor({
      applicationContext,
      documentId,
    });

    await applicationContext.getUseCases().validatePdfInteractor({
      applicationContext,
      documentId,
    });

    // TODO: ghostscript is causing problems with fonts on generated orders
    // - this will be resolved in a cleanup issue later
    /*await applicationContext.getUseCases().sanitizePdfInteractor({
      applicationContext,
      documentId,
    });*/

    caseDetail = await applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor({
        applicationContext,
        documentMetadata,
        primaryDocumentFileId,
      });
  }

  return {
    caseDetail,
    caseId: docketNumber,
  };
};
