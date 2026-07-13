import { CaseWithSelectionInfo } from '@web-client/business/utilities/getSelectedConsolidatedCasesToMultiDocketOn';
import { normalizeAdditionalOrderTextArray } from '@web-client/utilities/normalizeAdditionalOrderTextArray';
import { state } from '@web-client/presenter/app.cerebral';

export const submitCourtIssuedOrderAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  primaryDocumentFileId: string;
  createOrderSelectedCases?;
}>) => {
  const { docketNumber } = get(state.caseDetail);
  const { primaryDocumentFileId: documentStorageId } = props;
  const formData = get(state.form);
  const { docketEntryIdToEdit } = formData;
  const consolidatedCasesToMultiDocketOn =
    props.createOrderSelectedCases ||
    get(state.modal.form.consolidatedCasesToMultiDocketOn);

  const consolidatedCasesToMultiDocketOnMetaData: CaseWithSelectionInfo[] = (
    consolidatedCasesToMultiDocketOn || []
  ).map(caseInfo => ({
    checked: caseInfo.checked,
    docketNumberWithSuffix: caseInfo.docketNumberWithSuffix,
  }));

  const addedDocketNumbers = applicationContext
    .getUtilities()
    .getSelectedConsolidatedCasesToMultiDocketOn(
      consolidatedCasesToMultiDocketOnMetaData,
    );

  const documentMetadata = Object.fromEntries(
    Object.entries({
      additionalOrderText: formData.additionalOrderText,
      additionalOrderTextArray: formData.additionalOrderTextArray,
      deniedAsMoot: formData.deniedAsMoot,
      deniedWithoutPrejudice: formData.deniedWithoutPrejudice,
      disposition: formData.disposition,
      dueDateMessage: formData.dueDateMessage,
      filingParty: formData.filingParty,
      strickenFromTrialSession: formData.strickenFromTrialSession,
      affectedDocketEntries: formData.affectedDocketEntries,
      attachments: formData.attachments,
      date: formData.date,
      docketEntryDescription: formData.docketEntryDescription,
      docketEntryId: formData.docketEntryId,
      docketNumber,
      docketNumbers: formData.docketNumbers,
      documentContents: formData.documentContents,
      documentTitle: formData.documentTitle,
      documentType: formData.documentType,
      dueDate: formData.dueDate,
      dueDateFormatted: formData.dueDateFormatted,
      editorDelta: formData.editorDelta,
      eventCode: formData.eventCode,
      filingDate: formData.filingDate,
      freeText: formData.freeText,
      initialFreeText: formData.initialFreeText,
      isLegacy: formData.isLegacy,
      isOnLeadCase: formData.isOnLeadCase,
      issueOrder: formData.issueOrder,
      issueOrderFor: formData.issueOrderFor,
      judge: formData.judge,
      judgeWithTitle: formData.judgeWithTitle,
      jurisdiction: formData.jurisdiction,
      motionOrderResponse: formData.motionOrderResponse,
      motionOrderResponseFilingDate: formData.motionOrderResponseFilingDate,
      orderType: formData.orderType,
      parentMessageId: formData.parentMessageId,
      previousDocument: formData.previousDocument,
      responseDate: formData.responseDate,
      richText: formData.richText,
      scenario: formData.scenario,
      serviceStamp: formData.serviceStamp,
      showStrickenFromTrialSession: formData.showStrickenFromTrialSession,
      signedAt: formData.signedAt,
      signedByUserId: formData.signedByUserId,
      signedJudgeName: formData.signedJudgeName,
      statusReportFilingDate: formData.statusReportFilingDate,
      statusReportIndex: formData.statusReportIndex,
      strickenFromTrialSession: formData.strickenFromTrialSession,
      strickenFromTrialSessions: formData.strickenFromTrialSessions,
      trialLocation: formData.trialLocation,
    }).filter(([, value]) => value !== undefined),
  );

  if (Array.isArray(documentMetadata.additionalOrderTextArray)) {
    const forPersistence = normalizeAdditionalOrderTextArray(
      documentMetadata.additionalOrderTextArray,
    );
    documentMetadata.additionalOrderTextArray =
      forPersistence.length > 0 ? forPersistence : [];
  }

  if (Array.isArray(documentMetadata.additionalOrderText)) {
    const forPersistence = normalizeAdditionalOrderTextArray(
      documentMetadata.additionalOrderText,
    );
    documentMetadata.additionalOrderText =
      forPersistence.length > 0 ? forPersistence : [];
  }

  documentMetadata.draftOrderState = {
    ...documentMetadata,
    addedDocketNumbers,
  };

  await applicationContext
    .getUseCases()
    .validatePdfInteractor(applicationContext, {
      key: documentStorageId,
    });

  if (docketEntryIdToEdit) {
    await applicationContext
      .getUseCases()
      .updateCourtIssuedOrderInteractor(applicationContext, {
        docketEntryIdToEdit,
        documentMetadata,
      });
  } else {
    await applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor(applicationContext, {
        documentMetadata,
        primaryDocumentFileId: documentStorageId,
      });
  }

  return {
    docketEntryId: documentStorageId,
    docketNumber,
    eventCode: documentMetadata.eventCode,
  };
};
