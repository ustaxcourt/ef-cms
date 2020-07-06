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

  result.otherFilers = (result.otherFilers || []).map(otherFiler => ({
    ...otherFiler,
    showEAccessFlag: !isExternalUser && otherFiler.hasEAccess,
  }));

  result.otherPetitioners = (result.otherPetitioners || []).map(
    otherPetitioner => ({
      ...otherPetitioner,
      showEAccessFlag: !isExternalUser && otherPetitioner.hasEAccess,
    }),
  );

  result.contactPrimary = {
    ...result.contactPrimary,
    showEAccessFlag: !isExternalUser && result.contactPrimary.hasEAccess,
  };

  if (result.contactSecondary) {
    result.contactSecondary = {
      ...result.contactSecondary,
      showEAccessFlag: !isExternalUser && result.contactSecondary.hasEAccess,
    };
  }

  result.formattedDocketEntries = result.docketRecordWithDocument.map(
    ({ document, index, record }) => {
      const userHasAccessToCase = !isExternalUser || userAssociatedWithCase;
      const userHasAccessToDocument = record.isAvailableToUser;

      const formattedResult = {
        ...record,
        ...document,
        descriptionDisplay: record.description,
        index,
        numberOfPages: 0,
      };

      if (document) {
        if (!formattedResult.eventCode) {
          formattedResult.eventCode = document.eventCode;
        }
        formattedResult.isServed = !!document.servedAt;
        formattedResult.numberOfPages =
          record.numberOfPages || document.numberOfPages || 0;

        formattedResult.isInProgress = !isExternalUser && document.isInProgress;
        formattedResult.qcWorkItemsUntouched =
          !formattedResult.isInProgress &&
          !isExternalUser &&
          document.qcWorkItemsUntouched &&
          !document.isCourtIssuedDocument;

        formattedResult.hasCourtIssuedDocument = document.isCourtIssuedDocument;
        formattedResult.hasServedCourtIssuedDocument =
          formattedResult.hasCourtIssuedDocument && !!document.servedAt;
        formattedResult.hasSystemGeneratedDocument = systemGeneratedEventCodes.includes(
          document.eventCode,
        );
        formattedResult.isPaper =
          !formattedResult.isInProgress &&
          !formattedResult.qcWorkItemsUntouched &&
          document.isPaper;

        formattedResult.showDocumentViewerLink =
          permissions.UPDATE_CASE &&
          (!document.isInProgress ||
            ((permissions.DOCKET_ENTRY ||
              permissions.CREATE_ORDER_DOCKET_ENTRY) &&
              document.isInProgress));
        formattedResult.showLinkToDocument =
          (isExternalUser ? !record.isStricken : userHasAccessToCase) &&
          userHasAccessToCase &&
          userHasAccessToDocument &&
          !permissions.UPDATE_CASE &&
          document.processingStatus === 'complete' &&
          !document.isInProgress &&
          !document.isNotServedCourtIssuedDocument;

        if (document.documentTitle) {
          formattedResult.descriptionDisplay = document.documentTitle;
          if (document.additionalInfo) {
            formattedResult.descriptionDisplay += ` ${document.additionalInfo}`;
          }
        }

        formattedResult.showDocumentProcessing =
          !permissions.UPDATE_CASE && document.processingStatus !== 'complete';

        formattedResult.showLoadingIcon =
          !permissions.UPDATE_CASE &&
          !isExternalUser &&
          document.processingStatus !== 'complete';

        formattedResult.showNotServed = document.isNotServedCourtIssuedDocument;
        formattedResult.showServed = document.isStatusServed;
      }

      formattedResult.showEditDocketRecordEntry =
        permissions.EDIT_DOCKET_ENTRY &&
        (!document || document.qcWorkItemsCompleted) &&
        !formattedResult.hasSystemGeneratedDocument &&
        (!formattedResult.hasCourtIssuedDocument ||
          formattedResult.hasServedCourtIssuedDocument);

      formattedResult.filingsAndProceedingsWithAdditionalInfo = '';
      if (record.filingsAndProceedings) {
        formattedResult.filingsAndProceedingsWithAdditionalInfo += ` ${record.filingsAndProceedings}`;
      }
      if (document && document.additionalInfo2) {
        formattedResult.filingsAndProceedingsWithAdditionalInfo += ` ${document.additionalInfo2}`;
      }

      formattedResult.showDocumentDescriptionWithoutLink =
        !formattedResult.showDocumentViewerLink &&
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

      return formattedResult;
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
