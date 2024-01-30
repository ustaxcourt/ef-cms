/* eslint-disable complexity */
import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

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
  rawCase,
  user,
  visibilityPolicyDateFormatted,
}) => {
  const { DOCKET_ENTRY_SEALED_TO_TYPES, DOCUMENT_PROCESSING_STATUS_OPTIONS } =
    applicationContext.getConstants();

  const formattedResult = {
    numberOfPages: 0,
    ...entry,
    createdAtFormatted: entry.createdAtFormatted,
  };

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

  const showDocumentLinks = DocketEntry.isDownloadable(entry, {
    isTerminalUser: false,
    rawCase,
    user,
    visibilityChangeDate: visibilityPolicyDateFormatted,
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
  // const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const { docketRecordFilter } = get(state.sessionMetadata);
  const {
    ALLOWLIST_FEATURE_FLAGS,
    DOCKET_RECORD_FILTER_OPTIONS,
    EXHIBIT_EVENT_CODES,
    MOTION_EVENT_CODES,
  } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const { docketNumber } = caseDetail;
  let docketRecordSort;
  const { formatCase, sortDocketEntries } = applicationContext.getUtilities();
  if (docketNumber) {
    docketRecordSort = get(
      state.sessionMetadata.docketRecordSort[docketNumber],
    );
  }
  const DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key
    ],
  );
  const visibilityPolicyDateFormatted = applicationContext
    .getUtilities()
    .prepareDateFromString(DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE)
    .toISO();

  const result = formatCase(applicationContext, caseDetail);

  switch (docketRecordFilter) {
    case DOCKET_RECORD_FILTER_OPTIONS.exhibits:
      result.formattedDocketEntries = result.formattedDocketEntries.filter(
        entry => EXHIBIT_EVENT_CODES.includes(entry.eventCode),
      );
      break;
    case DOCKET_RECORD_FILTER_OPTIONS.motions:
      result.formattedDocketEntries = result.formattedDocketEntries.filter(
        entry => MOTION_EVENT_CODES.includes(entry.eventCode) && !entry.isDraft,
      );
      break;
    case DOCKET_RECORD_FILTER_OPTIONS.orders:
      result.formattedDocketEntries = result.formattedDocketEntries.filter(
        entry => DocketEntry.isOrder(entry.eventCode) && !entry.isDraft,
      );
      break;
  }

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
      rawCase: caseDetail,
      user,
      visibilityPolicyDateFormatted,
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
