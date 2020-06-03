import { state } from 'cerebral';

export const formattedCases = (get, applicationContext) => {
  const { formatCase } = applicationContext.getUtilities();

  const cases = get(state.cases);
  return cases.map(myCase => formatCase(applicationContext, myCase));
};

export const formattedCaseDetail = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const permissions = get(state.permissions);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const { SYSTEM_GENERATED_DOCUMENT_TYPES } = applicationContext.getConstants();
  const systemGeneratedEventCodes = Object.keys(
    SYSTEM_GENERATED_DOCUMENT_TYPES,
  ).map(key => {
    return SYSTEM_GENERATED_DOCUMENT_TYPES[key].eventCode;
  });

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
      const userHasAccessToDocument = record.isAvailableToUser;

      const isInProgress = !isExternalUser && document && document.isInProgress;

      const qcWorkItemsUntouched =
        !isInProgress &&
        !isExternalUser &&
        document &&
        document.qcWorkItemsUntouched &&
        !document.isCourtIssuedDocument;

      const hasCourtIssuedDocument = document && document.isCourtIssuedDocument;
      const hasServedCourtIssuedDocument =
        hasCourtIssuedDocument && !!document.servedAt;

      const hasSystemGeneratedDocument =
        document && systemGeneratedEventCodes.includes(document.eventCode);

      const showEditDocketRecordEntry =
        permissions.EDIT_DOCKET_ENTRY &&
        (!document || document.qcWorkItemsCompleted) &&
        !hasSystemGeneratedDocument &&
        (!hasCourtIssuedDocument || hasServedCourtIssuedDocument);

      const isPaper =
        !isInProgress && !qcWorkItemsUntouched && document && document.isPaper;

      let filingsAndProceedingsWithAdditionalInfo = '';
      if (record.filingsAndProceedings) {
        filingsAndProceedingsWithAdditionalInfo += ` ${record.filingsAndProceedings}`;
      }
      if (document && document.additionalInfo2) {
        filingsAndProceedingsWithAdditionalInfo += ` ${document.additionalInfo2}`;
      }

      const showDocumentEditLink =
        document &&
        permissions.UPDATE_CASE &&
        (!document.isInProgress ||
          ((permissions.DOCKET_ENTRY ||
            permissions.CREATE_ORDER_DOCKET_ENTRY) &&
            document.isInProgress));

      let editLink = ''; //defaults to doc detail

      if (
        showDocumentEditLink &&
        (permissions.DOCKET_ENTRY || permissions.CREATE_ORDER_DOCKET_ENTRY) &&
        document
      ) {
        if (document.isCourtIssuedDocument && !document.servedAt) {
          editLink = '/edit-court-issued';
        } else if (isInProgress) {
          editLink = '/complete';
        } else if (
          !document.isCourtIssuedDocument &&
          !document.isPetition &&
          qcWorkItemsUntouched &&
          permissions.DOCKET_ENTRY
        ) {
          editLink = '/edit';
        }
      }

      let descriptionDisplay = record.description;

      if (document && document.documentTitle) {
        descriptionDisplay = document.documentTitle;
        if (document.additionalInfo) {
          descriptionDisplay += ` ${document.additionalInfo}`;
        }
      }

      return {
        action: record.action,
        createdAtFormatted: record.createdAtFormatted,
        description: record.description,
        descriptionDisplay,
        documentId: document && document.documentId,
        editLink,
        eventCode: record.eventCode || (document && document.eventCode),
        filedBy: (document && document.filedBy) || record.filedBy,
        filingsAndProceedingsWithAdditionalInfo,
        hasDocument: !!document,
        index,
        isCourtIssuedDocument: document && document.isCourtIssuedDocument,
        isFileAttached: document && document.isFileAttached,
        isPaper,
        isPending: document && document.pending,
        isServed: document && !!document.servedAt,
        servedAtFormatted: document && document.servedAtFormatted,
        servedPartiesCode:
          record.servedPartiesCode || (document && document.servedPartiesCode),
        showDocumentDescriptionWithoutLink:
          !showDocumentEditLink &&
          (!userHasAccessToCase ||
            !userHasAccessToDocument ||
            !document ||
            (document &&
              (document.isNotServedCourtIssuedDocument ||
                document.isInProgress) &&
              !(
                permissions.DOCKET_ENTRY ||
                permissions.CREATE_ORDER_DOCKET_ENTRY
              ))),
        showDocumentEditLink,
        showDocumentProcessing:
          document &&
          !permissions.UPDATE_CASE &&
          document.processingStatus !== 'complete',
        showEditDocketRecordEntry,
        showInProgress: document && document.isInProgress && !isExternalUser,
        showLinkToDocument:
          userHasAccessToCase &&
          userHasAccessToDocument &&
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
        editLink: '',
        showDocumentEditLink: draftDocument && permissions.UPDATE_CASE,
      };
    },
  );

  result.pendingItemsDocketEntries = result.formattedDocketEntries.filter(
    entry => entry.hasDocument && entry.isPending,
  );

  result.consolidatedCases = result.consolidatedCases || [];

  result.showBlockedTag = caseDetail.blocked || caseDetail.automaticBlocked;
  result.docketRecordSort = docketRecordSort;
  result.caseDeadlines = formatCaseDeadlines(applicationContext, caseDeadlines);
  return result;
};
