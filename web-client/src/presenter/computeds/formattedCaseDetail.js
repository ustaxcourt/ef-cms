import { state } from 'cerebral';

export const formattedOpenCases = (get, applicationContext) => {
  const { formatCase } = applicationContext.getUtilities();

  const cases = get(state.openCases);
  return cases.map(myCase => formatCase(applicationContext, myCase));
};

export const formattedClosedCases = (get, applicationContext) => {
  const { formatCase } = applicationContext.getUtilities();

  const cases = get(state.closedCases);
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

      const result = {
        ...record,
        ...document,
        descriptionDisplay: record.description,
        index,
        numberOfPages: 0,
      };

      if (document) {
        if (!result.eventCode) {
          result.eventCode = document.eventCode;
        }
        result.isServed = !!document.servedAt;
        result.numberOfPages =
          record.numberOfPages || document.numberOfPages || 0;

        result.isInProgress = !isExternalUser && document.isInProgress;
        result.qcWorkItemsUntouched =
          !result.isInProgress &&
          !isExternalUser &&
          document.qcWorkItemsUntouched &&
          !document.isCourtIssuedDocument;

        result.hasCourtIssuedDocument = document.isCourtIssuedDocument;
        result.hasServedCourtIssuedDocument =
          result.hasCourtIssuedDocument && !!document.servedAt;
        result.hasSystemGeneratedDocument = systemGeneratedEventCodes.includes(
          document.eventCode,
        );
        result.isPaper =
          !result.isInProgress &&
          !result.qcWorkItemsUntouched &&
          document.isPaper;

        result.showDocumentViewerLink =
          permissions.UPDATE_CASE &&
          (!document.isInProgress ||
            ((permissions.DOCKET_ENTRY ||
              permissions.CREATE_ORDER_DOCKET_ENTRY) &&
              document.isInProgress));
        result.showLinkToDocument =
          (isExternalUser ? !record.isStricken : userHasAccessToCase) &&
          userHasAccessToCase &&
          userHasAccessToDocument &&
          !permissions.UPDATE_CASE &&
          document.processingStatus === 'complete' &&
          !document.isInProgress &&
          !document.isNotServedCourtIssuedDocument;

        if (document.documentTitle) {
          result.descriptionDisplay = document.documentTitle;
          if (document.additionalInfo) {
            result.descriptionDisplay += ` ${document.additionalInfo}`;
          }
        }

        result.showDocumentProcessing =
          !permissions.UPDATE_CASE && document.processingStatus !== 'complete';

        result.showLoadingIcon =
          !permissions.UPDATE_CASE &&
          !isExternalUser &&
          document.processingStatus !== 'complete';

        result.showNotServed = document.isNotServedCourtIssuedDocument;
        result.showServed = document.isStatusServed;
      }

      result.showEditDocketRecordEntry =
        permissions.EDIT_DOCKET_ENTRY &&
        (!document || document.qcWorkItemsCompleted) &&
        !result.hasSystemGeneratedDocument &&
        (!result.hasCourtIssuedDocument || result.hasServedCourtIssuedDocument);

      result.filingsAndProceedingsWithAdditionalInfo = '';
      if (record.filingsAndProceedings) {
        result.filingsAndProceedingsWithAdditionalInfo += ` ${record.filingsAndProceedings}`;
      }
      if (document && document.additionalInfo2) {
        result.filingsAndProceedingsWithAdditionalInfo += ` ${document.additionalInfo2}`;
      }

      result.showDocumentDescriptionWithoutLink =
        !result.showDocumentViewerLink &&
        (!userHasAccessToCase ||
          !userHasAccessToDocument ||
          !document ||
          (userHasAccessToCase &&
            userHasAccessToDocument &&
            record.isStricken) ||
          (document &&
            (document.isNotServedCourtIssuedDocument ||
              document.isInProgress) &&
            !(
              permissions.DOCKET_ENTRY || permissions.CREATE_ORDER_DOCKET_ENTRY
            )));

      return result;
    },
  );

  result.formattedDraftDocuments = (result.draftDocuments || []).map(
    draftDocument => {
      return {
        ...draftDocument,
        descriptionDisplay: draftDocument.documentTitle,
        showDocumentViewerLink: permissions.UPDATE_CASE,
      };
    },
  );

  result.pendingItemsDocketEntries = result.formattedDocketEntries.filter(
    entry => entry.pending,
  );

  result.consolidatedCases = result.consolidatedCases || [];

  result.showBlockedTag = caseDetail.blocked || caseDetail.automaticBlocked;
  result.docketRecordSort = docketRecordSort;
  result.caseDeadlines = formatCaseDeadlines(applicationContext, caseDeadlines);
  return result;
};
