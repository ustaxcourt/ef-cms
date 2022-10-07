import { omit } from 'lodash';
import { state } from 'cerebral';

/**
 * calls interactor to add or edit a paper filing
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const submitPaperFilingAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { docketNumbers, isSavingForLater, primaryDocumentFileId } = props;
  const { docketNumber } = get(state.caseDetail);
  const isFileAttachedNow = get(state.form.primaryDocumentFile);
  const clientConnectionId = get(state.clientConnectionId);
  const isEditingDocketEntry = get(state.isEditingDocketEntry);
  const isFileAttached = get(state.form.isFileAttached) || isFileAttachedNow;

  let caseDetail;
  let docketEntryId;

  if (isEditingDocketEntry) {
    docketEntryId = get(state.docketEntryId);
  } else if (isFileAttached) {
    docketEntryId = primaryDocumentFileId;
  } else {
    docketEntryId = applicationContext.getUniqueId();
  }

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
    receivedAt: documentMetadata.dateReceived,
  };

  if (isFileAttachedNow) {
    await applicationContext
      .getUseCases()
      .getStatusOfVirusScanInteractor(applicationContext, {
        key: docketEntryId,
      });

    await applicationContext
      .getUseCases()
      .validatePdfInteractor(applicationContext, {
        key: docketEntryId,
      });
  }

  let paperServicePdfUrl;

  if (isEditingDocketEntry) {
    ({ caseDetail, paperServicePdfUrl } = await applicationContext
      .getUseCases()
      .editPaperFilingInteractor(applicationContext, {
        documentMetadata,
        isSavingForLater,
        primaryDocumentFileId: docketEntryId,
      }));

    const generateCoversheet = isFileAttached && !isSavingForLater;
    if (generateCoversheet) {
      await applicationContext
        .getUseCases()
        .addCoversheetInteractor(applicationContext, {
          docketEntryId,
          docketNumber: caseDetail.docketNumber,
        });
    }
  } else {
    await applicationContext
      .getUseCases()
      .addPaperFilingInteractor(applicationContext, {
        clientConnectionId,
        consolidatedGroupDocketNumbers: docketNumbers,
        documentMetadata,
        isSavingForLater,
        primaryDocumentFileId: docketEntryId,
      });
  }

  return {
    caseDetail: caseDetail || {},
    docketEntryId,
    docketNumber,
    overridePaperServiceAddress: true,
    pdfUrl: paperServicePdfUrl,
  };
};
