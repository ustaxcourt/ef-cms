import { SERVICE_INDICATOR_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
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

const getUserIsAssignedToSession = ({ currentUser, get, trialSessionId }) => {
  const sessions = get(state.trialSessions);
  let session;
  if (sessions) {
    session = sessions.find(s => s.trialSessionId === trialSessionId);
  }

  const judge = get(state.judgeUser);

  const isJudgeUserAssigned = session?.judge?.userId === currentUser.userId;
  const isChambersUserAssigned =
    judge &&
    session?.judge?.userId === judge.userId &&
    judge.section === currentUser.section;
  const isTrialClerkUserAssigned =
    session?.trialClerk?.userId === currentUser.userId;

  return !!(
    isJudgeUserAssigned ||
    isTrialClerkUserAssigned ||
    isChambersUserAssigned
  );
};

export const getShowDocumentViewerLink = ({
  hasDocument,
  isCourtIssuedDocument,
  isExternalUser,
  isHiddenToPublic,
  isInitialDocument,
  isLegacySealed,
  isServed,
  isStipDecision,
  isStricken,
  isUnservable,
  userHasAccessToCase,
  userHasNoAccessToDocument,
}) => {
  if (!hasDocument) return false;
  if (!userHasAccessToCase && isHiddenToPublic) return false;

  if (isExternalUser) {
    if (isStricken) return false;
    if (isLegacySealed) return false;
    if (userHasNoAccessToDocument) return false;
    if (isCourtIssuedDocument && !isStipDecision) {
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

const getCalendarDetailsForTrialSession = ({
  caseDocketNumber,
  trialSessionId,
  trialSessions,
}) => {
  let note;
  let addedAt;

  if (!trialSessions || !trialSessions.length) {
    return { addedAt, note };
  }

  const foundTrialSession = trialSessions.find(
    session => session.trialSessionId === trialSessionId,
  );

  if (foundTrialSession && foundTrialSession.caseOrder) {
    const trialSessionCase = foundTrialSession.caseOrder.find(
      sessionCase => sessionCase.docketNumber === caseDocketNumber,
    );

    note = trialSessionCase && trialSessionCase.calendarNotes;
    addedAt = trialSessionCase && trialSessionCase.addedToSessionAt;
  }

  return { addedAt, note };
};

export const getShowEditDocketRecordEntry = ({
  applicationContext,
  entry,
  userPermissions,
}) => {
  const { SYSTEM_GENERATED_DOCUMENT_TYPES, UNSERVABLE_EVENT_CODES } =
    applicationContext.getConstants();
  const systemGeneratedEventCodes = Object.keys(
    SYSTEM_GENERATED_DOCUMENT_TYPES,
  ).map(key => {
    return SYSTEM_GENERATED_DOCUMENT_TYPES[key].eventCode;
  });

  const hasSystemGeneratedDocument =
    entry && systemGeneratedEventCodes.includes(entry.eventCode);
  const hasCourtIssuedDocument = entry && entry.isCourtIssuedDocument;
  const hasServedCourtIssuedDocument =
    hasCourtIssuedDocument && applicationContext.getUtilities().isServed(entry);
  const hasUnservableCourtIssuedDocument =
    entry && UNSERVABLE_EVENT_CODES.includes(entry.eventCode);

  return (
    userPermissions.EDIT_DOCKET_ENTRY &&
    (hasSystemGeneratedDocument ||
      entry.isMinuteEntry ||
      entry.qcWorkItemsCompleted) &&
    (!hasCourtIssuedDocument ||
      hasServedCourtIssuedDocument ||
      hasUnservableCourtIssuedDocument)
  );
};

export const getFormattedDocketEntry = ({
  applicationContext,
  docketNumber,
  entry,
  isExternalUser,
  permissions,
  userAssociatedWithCase,
}) => {
  const {
    DOCUMENT_PROCESSING_STATUS_OPTIONS,
    EVENT_CODES_VISIBLE_TO_PUBLIC,
    INITIAL_DOCUMENT_TYPES,
  } = applicationContext.getConstants();

  const userHasAccessToCase = !isExternalUser || userAssociatedWithCase;
  const userHasAccessToDocument = entry.isAvailableToUser;

  const formattedResult = {
    numberOfPages: 0,
    ...entry,
    createdAtFormatted: entry.createdAtFormatted,
  };

  let showDocumentLinks = false;

  if (isExternalUser) {
    formattedResult.hideIcons = true;
  } else {
    formattedResult.showLoadingIcon =
      !permissions.UPDATE_CASE &&
      entry.processingStatus !== DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;
  }

  formattedResult.isPaper =
    !formattedResult.isInProgress &&
    !formattedResult.qcWorkItemsUntouched &&
    entry.isPaper;

  if (entry.documentTitle) {
    formattedResult.descriptionDisplay = applicationContext
      .getUtilities()
      .getDocumentTitleWithAdditionalInfo({ docketEntry: entry });
  }

  formattedResult.showDocumentProcessing =
    !permissions.UPDATE_CASE &&
    entry.processingStatus !== DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;

  formattedResult.showNotServed = entry.isNotServedDocument;
  formattedResult.showServed = entry.isStatusServed;

  const isInitialDocument = Object.keys(INITIAL_DOCUMENT_TYPES)
    .map(k => INITIAL_DOCUMENT_TYPES[k].documentType)
    .includes(entry.documentType);

  showDocumentLinks = getShowDocumentViewerLink({
    hasDocument: entry.isFileAttached,
    isCourtIssuedDocument: entry.isCourtIssuedDocument,
    isExternalUser,
    isHiddenToPublic: !EVENT_CODES_VISIBLE_TO_PUBLIC.includes(entry.eventCode),
    isInitialDocument,
    isLegacySealed: entry.isLegacySealed,
    isServed: applicationContext.getUtilities().isServed(entry),
    isStipDecision: entry.isStipDecision,
    isStricken: entry.isStricken,
    isUnservable: formattedResult.isUnservable,
    userHasAccessToCase,
    userHasNoAccessToDocument: !userHasAccessToDocument,
  });

  formattedResult.showDocumentViewerLink = !isExternalUser && showDocumentLinks;

  formattedResult.showLinkToDocument = isExternalUser && showDocumentLinks;

  formattedResult.filingsAndProceedingsWithAdditionalInfo = '';
  if (entry.filingsAndProceedings) {
    formattedResult.filingsAndProceedingsWithAdditionalInfo += ` ${entry.filingsAndProceedings}`;
  }
  if (entry.additionalInfo2) {
    formattedResult.filingsAndProceedingsWithAdditionalInfo += ` ${entry.additionalInfo2}`;
  }

  formattedResult.showEditDocketRecordEntry = getShowEditDocketRecordEntry({
    applicationContext,
    entry,
    userPermissions: permissions,
  });

  formattedResult.showDocumentDescriptionWithoutLink =
    !showDocumentLinks && !formattedResult.showDocumentProcessing;

  formattedResult.editDocketEntryMetaLink = `/case-detail/${docketNumber}/docket-entry/${formattedResult.index}/edit-meta`;

  return formattedResult;
};

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

  result.otherFilers = (
    applicationContext.getUtilities().getOtherFilers(result) || []
  ).map(otherFiler => ({
    ...otherFiler,
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    showEAccessFlag: !isExternalUser && otherFiler.hasEAccess,
  }));

  result.otherPetitioners = (
    applicationContext.getUtilities().getOtherPetitioners(result) || []
  ).map(otherPetitioner => ({
    ...otherPetitioner,
    showEAccessFlag: !isExternalUser && otherPetitioner.hasEAccess,
  }));

  const contactPrimary = applicationContext
    .getUtilities()
    .getContactPrimary(result);

  result.contactPrimary = {
    ...contactPrimary,
    showEAccessFlag: !isExternalUser && contactPrimary?.hasEAccess,
  };
  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(result);

  if (contactSecondary) {
    result.contactSecondary = {
      ...contactSecondary,
      showEAccessFlag: !isExternalUser && contactSecondary.hasEAccess,
    };
  }

  result.formattedDocketEntries = result.formattedDocketEntries.map(entry =>
    getFormattedDocketEntry({
      applicationContext,
      docketNumber,
      entry,
      isExternalUser,
      permissions,
      userAssociatedWithCase,
    }),
  );

  result.formattedDocketEntriesOnDocketRecord =
    result.formattedDocketEntries.filter(d => d.isOnDocketRecord);

  result.formattedPendingDocketEntriesOnDocketRecord =
    result.formattedDocketEntriesOnDocketRecord.filter(docketEntry =>
      applicationContext.getUtilities().isPending(docketEntry),
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

  const allTrialSessions = get(state.trialSessions);

  const { note: trialSessionNotes } = getCalendarDetailsForTrialSession({
    caseDocketNumber: caseDetail.docketNumber,
    trialSessionId: caseDetail.trialSessionId,
    trialSessions: allTrialSessions,
  });

  result.trialSessionNotes = trialSessionNotes;

  if (result.hearings && result.hearings.length) {
    result.hearings.forEach(hearing => {
      const { addedAt, note } = getCalendarDetailsForTrialSession({
        caseDocketNumber: caseDetail.docketNumber,
        trialSessionId: hearing.trialSessionId,
        trialSessions: allTrialSessions,
      });

      hearing.calendarNotes = note;
      hearing.addedToSessionAt = addedAt;

      hearing.userIsAssignedToSession = getUserIsAssignedToSession({
        currentUser: user,
        get,
        trialSessionId: hearing.trialSessionId,
      });
    });

    result.hearings.sort((a, b) => {
      return applicationContext
        .getUtilities()
        .compareISODateStrings(a.addedToSessionAt, b.addedToSessionAt);
    });
  }

  result.userIsAssignedToSession = getUserIsAssignedToSession({
    currentUser: user,
    get,
    trialSessionId: caseDetail.trialSessionId,
  });

  result.docketRecordSort = docketRecordSort;
  result.caseDeadlines = formatCaseDeadlines(applicationContext, caseDeadlines);
  return result;
};
