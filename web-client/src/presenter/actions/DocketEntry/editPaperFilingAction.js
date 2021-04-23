import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * calls interactor to edit an unserved paper filing on a case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const editPaperFilingAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { docketNumber } = get(state.caseDetail);
  const { isSavingForLater } = props;
  const isFileAttachedNow = get(state.form.primaryDocumentFile);
  const isFileAttached = get(state.form.isFileAttached) || isFileAttachedNow;
  const generateCoversheet = isFileAttached && !isSavingForLater;

  const docketEntryId = get(state.docketEntryId);

  let documentMetadata = omit(
    {
      ...get(state.form),
    },
    ['primaryDocumentFile'],
  );

  documentMetadata = {
    ...documentMetadata,
    createdAt: documentMetadata.dateReceived,
    docketNumber,
    isFileAttached: !!isFileAttached,
    isPaper: true,
    isUpdating: true,
    receivedAt: documentMetadata.dateReceived,
  };

  if (isFileAttachedNow) {
    await applicationContext.getUseCases().virusScanPdfInteractor({
      applicationContext,
      key: docketEntryId,
    });

    await applicationContext.getUseCases().validatePdfInteractor({
      applicationContext,
      key: docketEntryId,
    });
  }

  const caseDetail = await applicationContext
    .getUseCases()
    .updateDocketEntryInteractor({
      applicationContext,
      documentMetadata,
      isSavingForLater,
      primaryDocumentFileId: docketEntryId,
    });

  if (generateCoversheet) {
    await applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      docketEntryId,
      docketNumber: caseDetail.docketNumber,
    });
  }

  return {
    caseDetail,
    docketEntryId,
    docketNumber,
    overridePaperServiceAddress: true,
  };
};
