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

export const getShowDocumentViewerLink = ({
  hasDocument,
  isCourtIssuedDocument,
  isExternalUser,
  isInitialDocument,
  isServed,
  isStricken,
  isUnservable,
  userHasAccessToCase,
  userHasNoAccessToDocument,
}) => {
  if (!hasDocument) return false;

  if (isExternalUser) {
    if (isStricken) return false;
    if (userHasNoAccessToDocument) return false;

    if (isCourtIssuedDocument) {
      if (isUnservable) return true;
      if (!isServed) return false;
    } else {
      if (!userHasAccessToCase) return false;
      if (isInitialDocument) return true;
      if (!isServed) return false;
    }
  }

  return true;
};

export const formattedCaseDetail = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const permissions = get(state.permissions);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const {
    DOCUMENT_PROCESSING_STATUS_OPTIONS,
    INITIAL_DOCUMENT_TYPES,
    SYSTEM_GENERATED_DOCUMENT_TYPES,
    UNSERVABLE_EVENT_CODES,
  } = applicationContext.getConstants();
  const systemGeneratedEventCodes = Object.keys(
    SYSTEM_GENERATED_DOCUMENT_TYPES,
  ).map(key => {
    return SYSTEM_GENERATED_DOCUMENT_TYPES[key].eventCode;
  });

  const {
    formatCase,
    formatCaseDeadlines,
    setServiceIndicatorsForCase,
    sortDocketEntries,
  } = applicationContext.getUtilities();

  let docketRecordSort;
  const caseDetail = get(state.caseDetail);

  const caseDeadlines = get(state.caseDeadlines);
  const docketNumber = get(state.caseDetail.docketNumber);
  if (docketNumber) {
    docketRecordSort = get(
      state.sessionMetadata.docketRecordSort[docketNumber],
    );
  }

  const result = {
    ...setServiceIndicatorsForCase(caseDetail),
    ...formatCase(applicationContext, caseDetail),
  };

  result.formattedDocketEntries = sortDocketEntries(
    result.formattedDocketEntries,
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

  const getShowEditDocketRecordEntry = ({ entry, userPermissions }) => {
    const hasSystemGeneratedDocument =
      entry && systemGeneratedEventCodes.includes(entry.eventCode);
    const hasCourtIssuedDocument = entry && entry.isCourtIssuedDocument;
    const hasServedCourtIssuedDocument =
      hasCourtIssuedDocument && !!entry.servedAt;
    const hasUnservableCourtIssuedDocument =
      entry && UNSERVABLE_EVENT_CODES.includes(entry.eventCode);

    return (
      userPermissions.EDIT_DOCKET_ENTRY &&
      (entry.isMinuteEntry || entry.qcWorkItemsCompleted) &&
      !hasSystemGeneratedDocument &&
      (!hasCourtIssuedDocument ||
        hasServedCourtIssuedDocument ||
        hasUnservableCourtIssuedDocument)
    );
  };

  result.formattedDocketEntries = result.formattedDocketEntries.map(entry => {
    const userHasAccessToCase = !isExternalUser || userAssociatedWithCase;
    const userHasAccessToDocument = entry.isAvailableToUser;

    const formattedResult = {
      numberOfPages: 0,
      ...entry,
      createdAtFormatted: entry.createdAtFormatted,
    };

    let showDocumentLinks = false;

    if (isExternalUser) {
      formattedResult.isInProgress = false;
      formattedResult.hideIcons = true;
      formattedResult.qcWorkItemsUntouched = false;
    } else {
      formattedResult.isInProgress = entry.isInProgress;

      formattedResult.qcWorkItemsUntouched =
        !formattedResult.isInProgress &&
        entry.qcWorkItemsUntouched &&
        !entry.isCourtIssuedDocument;

      formattedResult.showLoadingIcon =
        !permissions.UPDATE_CASE &&
        entry.processingStatus !== DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;
    }

    formattedResult.isPaper =
      !formattedResult.isInProgress &&
      !formattedResult.qcWorkItemsUntouched &&
      entry.isPaper;

    if (entry.documentTitle) {
      formattedResult.descriptionDisplay = entry.documentTitle;
      if (entry.additionalInfo) {
        formattedResult.descriptionDisplay += ` ${entry.additionalInfo}`;
      }
    }

    formattedResult.showDocumentProcessing =
      !permissions.UPDATE_CASE &&
      entry.processingStatus !== DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;

    formattedResult.showNotServed =
      !formattedResult.isUnservable &&
      entry.isNotServedDocument &&
      !entry.isMinuteEntry;
    formattedResult.showServed = entry.isStatusServed;

    const isInitialDocument = Object.keys(INITIAL_DOCUMENT_TYPES)
      .map(k => INITIAL_DOCUMENT_TYPES[k].documentType)
      .includes(entry.documentType);

    showDocumentLinks = getShowDocumentViewerLink({
      hasDocument: entry.isFileAttached,
      isCourtIssuedDocument: entry.isCourtIssuedDocument,
      isExternalUser,
      isInitialDocument,
      isServed: !!entry.servedAt,
      isStricken: entry.isStricken,
      isUnservable: formattedResult.isUnservable,
      userHasAccessToCase,
      userHasNoAccessToDocument: !userHasAccessToDocument,
    });

    formattedResult.showDocumentViewerLink =
      !isExternalUser && showDocumentLinks;

    formattedResult.showLinkToDocument = isExternalUser && showDocumentLinks;

    formattedResult.filingsAndProceedingsWithAdditionalInfo = '';
    if (entry.filingsAndProceedings) {
      formattedResult.filingsAndProceedingsWithAdditionalInfo += ` ${entry.filingsAndProceedings}`;
    }
    if (entry.additionalInfo2) {
      formattedResult.filingsAndProceedingsWithAdditionalInfo += ` ${entry.additionalInfo2}`;
    }

    formattedResult.showEditDocketRecordEntry = getShowEditDocketRecordEntry({
      entry,
      userPermissions: permissions,
    });

    formattedResult.showDocumentDescriptionWithoutLink = !showDocumentLinks;

    return formattedResult;
  });

  result.formattedDocketEntriesOnDocketRecord = result.formattedDocketEntries.filter(
    d => d.isOnDocketRecord,
  );

  result.formattedPendingDocketEntriesOnDocketRecord = result.formattedDocketEntriesOnDocketRecord.filter(
    d => d.pending,
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

  result.consolidatedCases = result.consolidatedCases || [];

  result.showBlockedTag = caseDetail.blocked || caseDetail.automaticBlocked;
  result.docketRecordSort = docketRecordSort;
  result.caseDeadlines = formatCaseDeadlines(applicationContext, caseDeadlines);
  return result;
};
