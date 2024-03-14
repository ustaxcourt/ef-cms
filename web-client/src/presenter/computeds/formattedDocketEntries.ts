/* eslint-disable complexity */
import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';
import { Get } from 'cerebral';
import { MINUTE_ENTRIES_MAP_WITHOUT_DOCS } from '@shared/business/entities/EntityConstants';
import { documentMeetsAgeRequirements } from '../../../../shared/src/business/utilities/getFormattedCaseDetail';
import {
  fetchRootDocument,
  getMeetsPolicyChangeRequirements,
} from './Public/publicCaseDetailHelper';
import { state } from '@web-client/presenter/app.cerebral';

export const isSelectableForDownload = entry => {
  return !entry.isMinuteEntry && entry.isFileAttached && entry.isOnDocketRecord;
};

type DocketEntriesSelectionType = (RawDocketEntry & {
  createdAtFormatted: string;
  isDocumentSelected?: boolean;
})[];

export const setupIconsToDisplay = ({ formattedResult, isExternalUser }) => {
  let iconsToDisplay: any[] = [];

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
  isPassingAgeRequirement,
  isSealed,
  isSealedToExternal,
  isServed,
  isStipDecision,
  isStricken,
  isUnservable,
  meetsPolicyChangeRequirements,
  userHasAccessToCase,
  userHasNoAccessToDocument,
}) => {
  if (!hasDocument) return false;
  if (!userHasAccessToCase && isHiddenToPublic) return false;

  if (isExternalUser) {
    if (isStricken) return false;
    if (isLegacySealed) return false;
    if (isSealed) {
      if (userHasAccessToCase && !isSealedToExternal) {
        return isPassingAgeRequirement;
      } else {
        return false;
      }
    }
    if (userHasNoAccessToDocument) return false;
    if (isCourtIssuedDocument && !isStipDecision) {
      if (isUnservable) return true;
      if (!isServed) return false;
    } else {
      if (isServed && meetsPolicyChangeRequirements) return true;
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
    hasCourtIssuedDocument && DocketEntry.isServed(entry);
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
  visibilityPolicyDateFormatted,
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
      .getDescriptionDisplay(entry);
  }

  formattedResult.showDocumentProcessing =
    !permissions.UPDATE_CASE &&
    entry.processingStatus !== DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;

  formattedResult.showNotServed = entry.isNotServedDocument;
  formattedResult.showServed = entry.isStatusServed;

  const isInitialDocument = Object.keys(INITIAL_DOCUMENT_TYPES)
    .map(k => INITIAL_DOCUMENT_TYPES[k].documentType)
    .includes(entry.documentType);

  const meetsPolicyChangeRequirements = getMeetsPolicyChangeRequirements(
    entry,
    visibilityPolicyDateFormatted,
  );

  showDocumentLinks = getShowDocumentViewerLink({
    hasDocument: entry.isFileAttached,
    isCourtIssuedDocument: entry.isCourtIssuedDocument,
    isExternalUser,
    isHiddenToPublic: !EVENT_CODES_VISIBLE_TO_PUBLIC.includes(entry.eventCode),
    isInitialDocument,
    isLegacySealed: entry.isLegacySealed,
    isPassingAgeRequirement: documentMeetsAgeRequirements(entry),
    isSealed: entry.isSealed,
    isSealedToExternal:
      entry.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL,
    isServed: DocketEntry.isServed(entry),
    isStipDecision: entry.isStipDecision,
    isStricken: entry.isStricken,
    isUnservable: formattedResult.isUnservable,
    meetsPolicyChangeRequirements,
    userHasAccessToCase,
    userHasNoAccessToDocument: !userHasAccessToDocument,
  });

  formattedResult.showDocumentViewerLink = !isExternalUser && showDocumentLinks;

  formattedResult.showLinkToDocument = isExternalUser && showDocumentLinks;

  formattedResult.showEditDocketRecordEntry = getShowEditDocketRecordEntry({
    applicationContext,
    entry,
    userPermissions: permissions,
  });

  formattedResult.showSealDocketRecordEntry = getShowSealDocketRecordEntry({
    applicationContext,
    entry,
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
  formattedResult.toolTipText = !formattedResult.isFileAttached
    ? 'No Document View'
    : undefined;

  return formattedResult;
};

export const formattedDocketEntries = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const user = applicationContext.getCurrentUser();
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const permissions = get(state.permissions);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const { docketRecordFilter } = get(state.sessionMetadata);
  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();

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

  result.formattedDocketEntries = applicationContext
    .getUtilities()
    .getDocketEntriesByFilter(applicationContext, {
      docketEntries: result.formattedDocketEntries,
      docketRecordFilter,
    });

  let docketEntriesFormatted: DocketEntriesSelectionType = sortDocketEntries(
    result.formattedDocketEntries,
    docketRecordSort,
  );

  const DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key
    ],
  );

  const visibilityPolicyDateFormatted = applicationContext
    .getUtilities()
    .prepareDateFromString(DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE)
    .toISO();

  const documentsSelectedForDownload = get(state.documentsSelectedForDownload);

  docketEntriesFormatted = docketEntriesFormatted
    .map((entry: any, _, array) => {
      return { ...entry, rootDocument: fetchRootDocument(entry, array) };
    })
    .map(entry => {
      return getFormattedDocketEntry({
        applicationContext,
        docketNumber,
        entry,
        isExternalUser,
        permissions,
        userAssociatedWithCase,
        visibilityPolicyDateFormatted,
      });
    })
    .map(docketEntry => {
      const computeMinuteEntry = (rawDocketEntry: RawDocketEntry): boolean => {
        const MINUTE_ENTRIES_EVENT_CODES = Object.keys(
          MINUTE_ENTRIES_MAP_WITHOUT_DOCS,
        ).map(key => MINUTE_ENTRIES_MAP_WITHOUT_DOCS[key].eventCode);

        return MINUTE_ENTRIES_EVENT_CODES.includes(rawDocketEntry.eventCode);
      };
      return {
        ...docketEntry,
        isDocumentSelected: documentsSelectedForDownload.some(
          docEntry => docEntry.docketEntryId === docketEntry.docketEntryId,
        ),
        isMinuteEntry: computeMinuteEntry(docketEntry),
      };
    });

  const selectableDocumentsCount = docketEntriesFormatted.filter(entry =>
    isSelectableForDownload(entry),
  ).length;
  const documentsSelectedForDownloadCount = docketEntriesFormatted.filter(
    entry => entry.isDocumentSelected && isSelectableForDownload(entry),
  ).length;

  const allDocumentsSelected =
    documentsSelectedForDownloadCount === selectableDocumentsCount &&
    selectableDocumentsCount !== 0;

  const canBatchDownload = permissions.BATCH_DOWNLOAD_CASE_DOCUMENTS; // do we need to revert this?

  const someDocumentsSelectedForDownload =
    canBatchDownload &&
    documentsSelectedForDownloadCount > 0 &&
    documentsSelectedForDownloadCount < selectableDocumentsCount;

  result.someDocumentsSelectedForDownload = someDocumentsSelectedForDownload;

  result.isDownloadLinkEnabled =
    someDocumentsSelectedForDownload || allDocumentsSelected;
  result.allDocumentsSelectedForDownload = allDocumentsSelected || false;

  result.formattedDocketEntriesOnDocketRecord = docketEntriesFormatted.filter(
    d => d.isOnDocketRecord,
  );

  result.isSelectableForDownload = isSelectableForDownload;

  result.allEligibleDocumentsForDownload = docketEntriesFormatted
    .filter(docEntry => isSelectableForDownload(docEntry))
    .map(docEntry => ({
      docketEntryId: docEntry.docketEntryId,
    }));

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
  console.log('result', result);
  return result;
};
