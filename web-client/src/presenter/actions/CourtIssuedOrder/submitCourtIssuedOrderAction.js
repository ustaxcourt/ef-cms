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
    await applicationContext.getUseCases().virusScanPdf({
      applicationContext,
      primaryDocumentFileId,
    });

    await applicationContext.getUseCases().validatePdf({
      applicationContext,
      primaryDocumentFileId,
    });

    await applicationContext.getUseCases().sanitizePdf({
      applicationContext,
      primaryDocumentFileId,
    });

    caseDetail = await applicationContext.getUseCases().fileExternalDocument({
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
