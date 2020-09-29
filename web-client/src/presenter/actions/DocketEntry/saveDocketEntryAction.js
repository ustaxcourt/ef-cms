import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * creates a new, or updates an existing docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const saveDocketEntryAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { docketNumber } = get(state.caseDetail);
  const { isSavingForLater, primaryDocumentFileId } = props;
  const isFileAttachedNow = get(state.form.primaryDocumentFile);
  const isFileAttached = get(state.form.isFileAttached) || isFileAttachedNow;
  const isUpdating = get(state.isEditingDocketEntry);
  const generateCoversheet = isFileAttached && !isSavingForLater;

  let docketEntryId;

  if (isUpdating) {
    docketEntryId = get(state.docketEntryId);
  } else if (isFileAttached) {
    docketEntryId = primaryDocumentFileId;
  } else {
    docketEntryId = applicationContext.getUniqueId();
  }

  let caseDetail;
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
    isUpdating,
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

  if (isUpdating) {
    caseDetail = await applicationContext
      .getUseCases()
      .updateDocketEntryInteractor({
        applicationContext,
        documentMetadata,
        isSavingForLater,
        primaryDocumentFileId: docketEntryId,
      });
  } else {
    caseDetail = await applicationContext
      .getUseCases()
      .fileDocketEntryInteractor({
        applicationContext,
        documentMetadata,
        isSavingForLater,
        primaryDocumentFileId: docketEntryId,
      });
  }

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
