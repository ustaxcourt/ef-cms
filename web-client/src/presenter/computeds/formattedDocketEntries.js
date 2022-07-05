import { state } from 'cerebral';

export const setupIconsToDisplay = ({ formattedResult, isExternalUser }) => {
  let iconsToDisplay = [];

  if (formattedResult.sealedTo) {
    iconsToDisplay.push({
      className: 'sealed-docket-entry',
      icon: 'lock',
      title: formattedResult.sealedToTooltip,
    });
  }

  if (isExternalUser) {
    return iconsToDisplay;
  } else if (formattedResult.isPaper) {
    iconsToDisplay.push({
      icon: ['fas', 'file-alt'],
      title: 'is paper',
    });
  } else if (formattedResult.isInProgress) {
    iconsToDisplay.push({
      icon: ['fas', 'thumbtack'],
      title: 'in progress',
    });
  } else if (formattedResult.qcNeeded) {
    iconsToDisplay.push({
      icon: ['fa', 'star'],
      title: 'is untouched',
    });
  } else if (formattedResult.showLoadingIcon) {
    iconsToDisplay.push({
      className: 'fa-spin spinner',
      icon: ['fa-spin', 'spinner'],
      title: 'is loading',
    });
  }

  return iconsToDisplay;
};

export const getShowDocumentViewerLink = ({
  hasDocument,
  isCourtIssuedDocument,
  isExternalUser,
  isHiddenToPublic,
  isInitialDocument,
  isLegacySealed,
  isSealed,
  isSealedToExternal,
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
    if (isSealed) {
      if (userHasAccessToCase && !isSealedToExternal) return true;
      else {
        return false;
      }
    }
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

export const getShowSealDocketRecordEntry = ({ applicationContext, entry }) => {
  const allOpinionEventCodes =
    applicationContext.getConstants().OPINION_EVENT_CODES_WITH_BENCH_OPINION;

  const docketEntryIsOpinion = allOpinionEventCodes.includes(entry.eventCode);

  return !docketEntryIsOpinion;
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
    DOCKET_ENTRY_SEALED_TO_TYPES,
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

  if (!isExternalUser) {
    formattedResult.showLoadingIcon =
      !permissions.UPDATE_CASE &&
      entry.processingStatus !== DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;
  }

  formattedResult.isPaper =
    !formattedResult.isInProgress &&
    !formattedResult.qcWorkItemsUntouched &&
    entry.isPaper;

  if (entry.isSealed) {
    formattedResult.sealedToTooltip = applicationContext
      .getUtilities()
      .getSealedDocketEntryTooltip(applicationContext, entry);
  }

  if (entry.documentTitle) {
    formattedResult.descriptionDisplay = applicationContext
      .getUtilities()
      .getDocumentTitleWithAdditionalInfo({ docketEntry: entry });

    if (entry.eventCode === 'OCS' && formattedResult.freeText) {
      formattedResult.descriptionDisplay = `${formattedResult.freeText} - ${formattedResult.descriptionDisplay}`;
    }
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
    isSealed: entry.isSealed,
    isSealedToExternal:
      entry.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
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

  formattedResult.showSealDocketRecordEntry = getShowSealDocketRecordEntry({
    applicationContext,
    entry,
    userPermissions: permissions,
  });

  formattedResult.showDocumentDescriptionWithoutLink =
    !showDocumentLinks && !formattedResult.showDocumentProcessing;

  formattedResult.editDocketEntryMetaLink = `/case-detail/${docketNumber}/docket-entry/${formattedResult.index}/edit-meta`;

  formattedResult.iconsToDisplay = setupIconsToDisplay({
    formattedResult,
    isExternalUser,
  });

  formattedResult.sealButtonText = formattedResult.isSealed ? 'Unseal' : 'Seal';
  formattedResult.sealIcon = formattedResult.isSealed ? 'unlock' : 'lock';
  formattedResult.sealButtonTooltip = formattedResult.isSealed
    ? formattedResult.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL
      ? 'Unseal to the public and parties of this case'
      : 'Unseal to the public'
    : 'Seal to the public';

  return formattedResult;
};

export const formattedDocketEntries = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const permissions = get(state.permissions);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);

  const { formatCase, sortDocketEntries } = applicationContext.getUtilities();

  const caseDetail = get(state.caseDetail);

  const { docketNumber } = caseDetail;

  let docketRecordSort;
  if (docketNumber) {
    docketRecordSort = get(
      state.sessionMetadata.docketRecordSort[docketNumber],
    );
  }

  const result = formatCase(applicationContext, caseDetail);

  let docketEntriesFormatted = sortDocketEntries(
    result.formattedDocketEntries,
    docketRecordSort,
  );

  docketEntriesFormatted = docketEntriesFormatted.map(entry =>
    getFormattedDocketEntry({
      applicationContext,
      docketNumber,
      entry,
      isExternalUser,
      permissions,
      userAssociatedWithCase,
    }),
  );

  result.formattedDocketEntriesOnDocketRecord = docketEntriesFormatted.filter(
    d => d.isOnDocketRecord,
  );

  result.formattedPendingDocketEntriesOnDocketRecord =
    result.formattedDocketEntriesOnDocketRecord.filter(docketEntry =>
      applicationContext.getUtilities().isPending(docketEntry),
    );

  result.formattedDraftDocuments = result.draftDocuments.map(draftDocument => {
    return {
      ...draftDocument,
      descriptionDisplay: draftDocument.documentTitle,
      showDocumentViewerLink: permissions.UPDATE_CASE,
    };
  });

  result.docketRecordSort = docketRecordSort;
  return result;
};
