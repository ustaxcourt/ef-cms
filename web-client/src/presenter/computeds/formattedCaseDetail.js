import { state } from 'cerebral';

export const formattedCaseDetail = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const permissions = get(state.permissions);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);

  const {
    formatCase,
    formatCaseDeadlines,
    sortDocketRecords,
  } = applicationContext.getUtilities();

  let docketRecordSort;
  const caseDetail = get(state.caseDetail);
  const caseDeadlines = get(state.caseDeadlines);
  const caseId = get(state.caseDetail.caseId);
  if (caseId) {
    docketRecordSort = get(state.sessionMetadata.docketRecordSort[caseId]);
  }
  const result = {
    ...applicationContext
      .getUtilities()
      .setServiceIndicatorsForCase(caseDetail),
    ...formatCase(applicationContext, caseDetail),
  };
  result.docketRecordWithDocument = sortDocketRecords(
    result.docketRecordWithDocument,
    docketRecordSort,
  );

  result.formattedDocketEntries = result.docketRecordWithDocument.map(
    ({ document, index, record }) => {
      const userHasAccessToCase = !isExternalUser || userAssociatedWithCase;

      const isInProgress = !isExternalUser && document && document.isInProgress;

      const qcWorkItemsUntouched =
        !isInProgress &&
        !isExternalUser &&
        document &&
        document.qcWorkItemsUntouched &&
        !document.isCourtIssuedDocument;

      const isPaper =
        !isInProgress && !qcWorkItemsUntouched && document && document.isPaper;

      let filingsAndProceedingsWithAdditionalInfo = '';
      if (document && document.documentTitle && document.additionalInfo) {
        filingsAndProceedingsWithAdditionalInfo += ` ${document.additionalInfo}`;
      }
      if (record.filingsAndProceedings) {
        filingsAndProceedingsWithAdditionalInfo += ` ${record.filingsAndProceedings}`;
      }
      if (document && document.additionalInfo2) {
        filingsAndProceedingsWithAdditionalInfo += ` ${document.additionalInfo2}`;
      }

      return {
        action: record.action,
        canEdit: document && document.canEdit,
        createdAtFormatted: record.createdAtFormatted,
        description: record.description,
        descriptionDisplay:
          (document && document.documentTitle) || record.description,
        documentId: document && document.documentId,
        eventCode: record.eventCode || (document && document.eventCode),
        filedBy: document && document.filedBy,
        filingsAndProceedingsWithAdditionalInfo,
        hasDocument: !!document,
        index,
        isCourtIssuedDocument: document && document.isCourtIssuedDocument,
        isFileAttached: document && document.isFileAttached,
        isPaper,
        isPending: document && document.pending,
        isServed: document && !!document.servedAt,
        servedAtFormatted: document && document.servedAtFormatted,
        servedPartiesCode: document && document.servedPartiesCode,
        showDocumentDescriptionWithoutLink:
          !userHasAccessToCase ||
          (document &&
            (document.isNotServedCourtIssuedDocument ||
              document.isInProgress) &&
            !permissions.DOCKET_ENTRY),
        showDocumentEditLink:
          document &&
          permissions.UPDATE_CASE &&
          (!document.isNotServedCourtIssuedDocument ||
            (document.isNotServedCourtIssuedDocument &&
              permissions.DOCKET_ENTRY)),
        showDocumentProcessing:
          document &&
          !permissions.UPDATE_CASE &&
          document.processingStatus !== 'complete',
        showInProgress: document && document.isInProgress && !isExternalUser,
        showLinkToDocument:
          userHasAccessToCase &&
          document &&
          !permissions.UPDATE_CASE &&
          document.processingStatus === 'complete' &&
          !document.isInProgress &&
          !document.isNotServedCourtIssuedDocument,
        showLoadingIcon:
          document &&
          !permissions.UPDATE_CASE &&
          !isExternalUser &&
          document.processingStatus !== 'complete', //TODO - this could never be true?
        showNotServed: document && document.isNotServedCourtIssuedDocument,
        showQcUntouched: qcWorkItemsUntouched,
        showServed: document && document.isStatusServed,
        signatory: record.signatory,
      };
    },
  );

  result.formattedDraftDocuments = (result.draftDocuments || []).map(
    draftDocument => {
      return {
        ...draftDocument,
        descriptionDisplay: draftDocument.documentTitle,
        showDocumentEditLink: draftDocument && permissions.UPDATE_CASE,
      };
    },
  );

  result.pendingItemsDocketEntries = result.formattedDocketEntries.filter(
    entry => entry.hasDocument && entry.isPending,
  );

  // TODO these are just defaults
  result.isConsolidatable = true;
  result.consolidatedCases = [];

  result.showBlockedTag = caseDetail.blocked;
  result.docketRecordSort = docketRecordSort;
  result.caseDeadlines = formatCaseDeadlines(applicationContext, caseDeadlines);
  return result;
};
