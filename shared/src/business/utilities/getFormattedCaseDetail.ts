import {
  CASE_STATUS_TYPES,
  COURT_ISSUED_EVENT_CODES,
  type DocketEntryRelation,
  OBJECTIONS_OPTIONS_MAP,
  PAYMENT_STATUS,
  STIPULATED_DECISION_EVENT_CODE,
  TRANSCRIPT_EVENT_CODE,
} from '../entities/EntityConstants';
import { Case, isLeadCase, isSealedCase } from '../entities/cases/Case';
import { DocketEntry } from '../entities/DocketEntry';
import {
  FORMATS,
  calculateDifferenceInDays,
  combineISOandEasternTime,
  formatDateString,
} from './DateHandler';
import { cloneDeep, isEmpty } from 'lodash';
import { getDescriptionDisplay } from '@shared/business/utilities/getDescriptionDisplay';
import { getSealedDocketEntryTooltip } from '@shared/business/utilities/getSealedDocketEntryTooltip';
import { isMiscellaneousDocketEntry } from '@shared/business/utilities/isMiscellaneousDocketEntry';
import { setServiceIndicatorsForPetitionersOnCase } from '@shared/business/utilities/setServiceIndicatorsForPetitionersOnCase';
import { type ClientApplicationContext } from '@web-client/applicationContext';
import { type ClientPublicApplicationContext } from '@web-client/applicationContextPublic';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { type RawConsolidatedCaseSummary } from '@shared/business/dto/cases/ConsolidatedCaseSummary';
import { type RawCorrespondence } from '@shared/business/entities/Correspondence';
import { type RawPractitioner } from '@shared/business/entities/Practitioner';
import { type ServerApplicationContext } from '@web-api/applicationContext';
import { type TAssociatedCase } from '@shared/business/useCases/getCasesForUserInteractor';
import { type UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export type RelatedDocketEntry = DocketEntryRelation & {
  dispositionLinkText: string[];
  dispositionText: [];
  docketEntryIndex?: number;
  showDocumentViewerLink: boolean;
  showDownloadLink: boolean;
};

export type FormattedCaseInventoryReportEntry = {
  docketNumber: string;
  caseTitle: string;
  consolidatedIconTooltipText: string;
  inConsolidatedGroup: boolean;
  isLeadCase: boolean;
  associatedJudge?: string;
  status: string;
  [key: string]: unknown;
};

type PreformattedCaseDetailDocketEntry = RawDocketEntry & {
  isCourtIssuedDocument: boolean;
  isUnservable: boolean;
};

export type FormattedCaseDetailDocketEntry = RawDocketEntry & {
  certificateOfServiceDateFormatted: string;
  createdAtFormatted: string;
  descriptionDisplay: string;
  filingsAndProceedings: string;
  hasWorkItemInfo: boolean;
  isCourtIssuedDocument: boolean;
  isInProgress: boolean;
  isNotServedDocument: boolean;
  isPaper: boolean;
  isPetition: boolean;
  isStatusServed: boolean;
  isStipDecision: boolean;
  isStricken: boolean;
  isTranscript: boolean;
  isUnservable: boolean;
  qcNeeded: boolean;
  qcWorkItemsCompleted: boolean;
  qcWorkItemsUntouched: boolean;
  sealedToTooltip: string;
  servedAtFormatted: string;
  showLegacySealed: boolean;
  showServedAt: boolean;
  signedAtFormatted: string;
  signedAtFormattedTZ: string;
  sortingFilingDate: string;
};

export type FormattedDocketEntry = FormattedCaseDetailDocketEntry & {
  editDocketEntryMetaLink: string;
  iconsToDisplay: {
    className: string;
    icon: IconProp;
    size: string;
    title: string;
  }[];
  relatedDocketEntries: RelatedDocketEntry[];
  sealButtonText: string;
  sealButtonTooltip: string;
  sealIcon: string;
  showDocumentDescriptionWithoutLink: boolean;
  showDocumentProcessing: boolean;
  showDocumentViewerLink: boolean;
  showEditDocketRecordEntry: boolean;
  showLinkToDocument: boolean;
  showLoadingIcon: boolean;
  showNotServed: boolean;
  showSealDocketRecordEntry: boolean;
  showServed: boolean;
  toolTipText: string;
};

type FormattedCounsel = RawPractitioner & {
  formattedName: string;
  representingFormatted?: {
    name: string;
    secondaryName: string;
    title: string;
  }[];
};

export type FormattedCase = RawCase & {
  blockedDateFormatted: string;
  canConsolidate: boolean;
  canUnconsolidate: boolean;
  caseTitle: string;
  consolidatedCases: any; // (RawConsolidatedCaseSummary & FormattedCase)[];
  consolidatedIconTooltipText: string;
  correspondence: (RawCorrespondence & { formattedFilingDate: string })[];
  createdAtFormatted: string;
  docketEntries: (RawDocketEntry & {
    editUrl?: string;
    signedAtFormatted?: string;
    signedAtFormattedTZ?: string;
    signUrl?: string;
  })[];
  draftDocuments: (FormattedCaseDetailDocketEntry & {
    editUrl?: string;
    signedAtFormatted?: string;
    signedAtFormattedTZ?: string;
    signUrl?: string;
  })[];
  draftDocumentsUnsorted: (FormattedCaseDetailDocketEntry & {
    editUrl?: string;
    signedAtFormatted?: string;
    signedAtFormattedTZ?: string;
    signUrl?: string;
  })[];
  filingFee: string;
  formattedAssociatedJudge: string;
  formattedDocketEntries: FormattedCaseDetailDocketEntry[];
  formattedPreferredTrialCity: string;
  formattedTrialCity: string;
  formattedTrialDate: string;
  inConsolidatedGroup: boolean;
  irsNoticeDateFormatted: string;
  irsPractitioners: FormattedCounsel[];
  irsSendDate: string;
  isConsolidatedSubCase: boolean;
  isLeadCase: boolean;
  isSealed: boolean;
  paymentDate: string;
  paymentMethod: string;
  pendingItemsDocketEntries: FormattedCaseDetailDocketEntry[];
  privatePractitioners: FormattedCounsel[];
  receivedAtFormatted: string;
  showBlockedFromTrial: boolean;
  showNotScheduled: boolean;
  showPrintConfirmationLink: boolean;
  showScheduled: boolean;
  shouldShowIrsNoticeDate: boolean;
  showTrialCalendared: boolean;
  trialLocation: string;
  trialTime: string;
};

export type FormattedCaseDetail = FormattedCase & {
  consolidatedCases: FormattedCase[];
  docketRecordSort?: string;
};

const computeIsInProgress = ({
  formattedEntry,
}: {
  formattedEntry: PreformattedCaseDetailDocketEntry;
}): boolean => {
  return (
    (!formattedEntry.isCourtIssuedDocument &&
      formattedEntry.isFileAttached === false &&
      !DocketEntry.isMinuteEntry(formattedEntry) &&
      !formattedEntry.isUnservable) ||
    (formattedEntry.isFileAttached === true &&
      !DocketEntry.isServed(formattedEntry) &&
      !formattedEntry.isUnservable)
  );
};

export const computeIsNotServedDocument = ({
  formattedEntry,
}: {
  formattedEntry: PreformattedCaseDetailDocketEntry | RawDocketEntry;
}): boolean => {
  return (
    formattedEntry.isDraft ||
    (!DocketEntry.isServed(formattedEntry) &&
      !DocketEntry.isUnservable(formattedEntry) &&
      !DocketEntry.isMinuteEntry(formattedEntry))
  );
};

export const formatDocketEntry = (
  applicationContext:
    | ServerApplicationContext
    | ClientApplicationContext
    | ClientPublicApplicationContext,
  docketEntry: RawDocketEntry,
): FormattedCaseDetailDocketEntry => {
  const preformattedEntry = cloneDeep(docketEntry);
  const hasWorkItemInfo = DocketEntry.hasWorkItemInfo(preformattedEntry);
  const isCourtIssuedDocument = COURT_ISSUED_EVENT_CODES.map(
    ({ eventCode }) => eventCode,
  ).includes(preformattedEntry.eventCode);
  const isUnservable = DocketEntry.isUnservable(preformattedEntry);
  const isInProgress = computeIsInProgress({
    formattedEntry: {
      ...preformattedEntry,
      isCourtIssuedDocument,
      isUnservable,
    },
  });
  const qcWorkItemsUntouched = hasWorkItemInfo && !preformattedEntry.qcComplete;

  const createdAtISO =
    isCourtIssuedDocument &&
    !preformattedEntry.servedAt &&
    !isUnservable &&
    preformattedEntry.isOnDocketRecord
      ? ''
      : preformattedEntry.isOnDocketRecord
        ? formatDateString(preformattedEntry.filingDate, FORMATS.ISO)
        : formatDateString(preformattedEntry.createdAt, FORMATS.ISO);
  const createdAtFormatted = formatDateString(createdAtISO, 'MMDDYY');
  const certificateOfServiceDateFormatted =
    preformattedEntry.certificateOfServiceDate
      ? formatDateString(preformattedEntry.certificateOfServiceDate, 'MMDDYY')
      : '';
  const filingsAndProceedings = getFilingsAndProceedings({
    ...preformattedEntry,
    certificateOfServiceDateFormatted,
  });

  return {
    ...preformattedEntry,
    certificateOfServiceDateFormatted,
    createdAtFormatted,
    descriptionDisplay: getDescriptionDisplay({
      ...preformattedEntry,
      filingsAndProceedings,
    }),
    eventCode: preformattedEntry.lodged ? 'MISCL' : preformattedEntry.eventCode,
    filingsAndProceedings,
    hasWorkItemInfo,
    isCourtIssuedDocument,
    isInProgress,
    isNotServedDocument: computeIsNotServedDocument({
      formattedEntry: {
        ...preformattedEntry,
        isCourtIssuedDocument,
        isUnservable,
      },
    }),
    isPaper: !!preformattedEntry.isPaper,
    isPetition:
      preformattedEntry.documentType === 'Petition' ||
      preformattedEntry.eventCode === 'P',
    isStatusServed: !!preformattedEntry.servedAt,
    isStipDecision:
      preformattedEntry.eventCode === STIPULATED_DECISION_EVENT_CODE,
    isStricken: !!preformattedEntry.isStricken,
    isTranscript: preformattedEntry.eventCode === TRANSCRIPT_EVENT_CODE,
    isUnservable,
    qcNeeded: qcWorkItemsUntouched && !isInProgress,
    qcWorkItemsCompleted: !hasWorkItemInfo || !!preformattedEntry.qcComplete,
    qcWorkItemsUntouched,
    sealedToTooltip: preformattedEntry.isLegacySealed
      ? 'Sealed in Blackstone'
      : preformattedEntry.isSealed
        ? getSealedDocketEntryTooltip(applicationContext, preformattedEntry)
        : '',
    servedAtFormatted: formatDateString(preformattedEntry.servedAt, 'MMDDYY'),
    showLegacySealed: !!preformattedEntry.isLegacySealed,
    showServedAt: !!preformattedEntry.servedAt,
    signedAtFormatted: formatDateString(preformattedEntry.signedAt, 'MMDDYY'),
    signedAtFormattedTZ: formatDateString(
      preformattedEntry.signedAt,
      'DATE_TIME_TZ',
    ),
    sortingFilingDate: createdAtISO
      ? formatDateString(createdAtISO, 'YYYYMMDD_NUMERIC')
      : '',
  };
};

export const getFilingsAndProceedings = (
  formattedDocketEntry: RawDocketEntry & {
    certificateOfServiceDateFormatted: string;
  },
): string => {
  //(C/S 04/17/2019) (Exhibit(s)) (Attachment(s)) (Objection) (Lodged)
  const filingsAndProceedingsArray = [
    `${
      formattedDocketEntry.certificateOfService
        ? `(C/S ${formattedDocketEntry.certificateOfServiceDateFormatted})`
        : ''
    }`,
    `${formattedDocketEntry.attachments ? '(Attachment(s))' : ''}`,
    `${
      formattedDocketEntry.objections === OBJECTIONS_OPTIONS_MAP.YES
        ? '(Objection)'
        : formattedDocketEntry.objections === OBJECTIONS_OPTIONS_MAP.NO
          ? '(No Objection)'
          : ''
    }`,
    `${formattedDocketEntry.lodged ? '(Lodged)' : ''}`,
  ];

  return filingsAndProceedingsArray.filter(item => item !== '').join(' ');
};

const formattedTrialSessionDetails = ({
  judgeName,
  trialDate,
  trialLocation,
  trialTime,
}: {
  judgeName: string;
  trialDate: string;
  trialLocation: string;
  trialTime: string;
}): {
  formattedAssociatedJudge: string;
  formattedTrialCity: string;
  formattedTrialDate: string;
} => {
  let formattedTrialDate: string;

  const formattedTrialCity = trialLocation || 'Not assigned';
  const formattedAssociatedJudge = judgeName || 'Not assigned';

  if (!trialDate) {
    formattedTrialDate = 'Not scheduled';
  } else if (trialTime) {
    const combinedDateTime = combineISOandEasternTime(trialDate, trialTime);
    formattedTrialDate = formatDateString(combinedDateTime, FORMATS.DATE_TIME);
  } else {
    formattedTrialDate = formatDateString(trialDate, FORMATS.MMDDYY);
  }

  return {
    formattedAssociatedJudge,
    formattedTrialCity,
    formattedTrialDate,
  };
};

const getEditUrl = (docketEntry: RawDocketEntry): string => {
  const routeToEditUploadCourtIssued = isMiscellaneousDocketEntry(docketEntry);

  return routeToEditUploadCourtIssued
    ? `/case-detail/${docketEntry.docketNumber}/edit-upload-court-issued/${docketEntry.docketEntryId}`
    : `/case-detail/${docketEntry.docketNumber}/edit-order/${docketEntry.docketEntryId}`;
};

export const formatCase = (
  applicationContext:
    | ServerApplicationContext
    | ClientApplicationContext
    | ClientPublicApplicationContext,
  caseDetail:
    | FormattedCaseInventoryReportEntry
    | RawCase
    | RawConsolidatedCaseSummary
    | TAssociatedCase,
  authorizedUser: UnknownAuthUser,
): FormattedCase => {
  if (isEmpty(caseDetail)) {
    return {} as FormattedCase;
  }
  const preformattedCase = cloneDeep(caseDetail) as unknown as RawCase;
  if (!preformattedCase.docketEntries) preformattedCase.docketEntries = [];
  if (!preformattedCase.correspondence) preformattedCase.correspondence = [];

  const draftDocumentsUnsorted = preformattedCase.docketEntries
    .filter(docketEntry => docketEntry.isDraft && !docketEntry.archived)
    .map(docketEntry => ({
      ...formatDocketEntry(applicationContext, docketEntry),
      editUrl: getEditUrl(docketEntry),
      signedAtFormatted: applicationContext
        .getUtilities()
        .formatDateString(docketEntry.signedAt, 'MMDDYY'),
      signedAtFormattedTZ: applicationContext
        .getUtilities()
        .formatDateString(docketEntry.signedAt, 'DATE_TIME_TZ'),
      signUrl: `/case-detail/${preformattedCase.docketNumber}/edit-order/${docketEntry.docketEntryId}/sign`,
    }));
  const draftDocuments = sortDocketEntries(draftDocumentsUnsorted);

  const formattedDocketEntries = preformattedCase.docketEntries.map(de =>
    formatDocketEntry(applicationContext, de),
  );
  formattedDocketEntries.sort(byIndexSortFunction);

  const caseIsLeadCase = isLeadCase(preformattedCase);
  const isConsolidatedSubCase = !!(
    preformattedCase.leadDocketNumber && !caseIsLeadCase
  );
  const inConsolidatedGroup = caseIsLeadCase || isConsolidatedSubCase;
  const paymentDate =
    preformattedCase.petitionPaymentStatus === PAYMENT_STATUS.PAID
      ? formatDateString(preformattedCase.petitionPaymentDate, 'MMDDYY')
      : preformattedCase.petitionPaymentStatus === PAYMENT_STATUS.WAIVED
        ? formatDateString(preformattedCase.petitionPaymentWaivedDate, 'MMDDYY')
        : '';
  const paymentMethod =
    preformattedCase.petitionPaymentStatus === PAYMENT_STATUS.PAID
      ? preformattedCase.petitionPaymentMethod || ''
      : '';
  const filingFee = `${preformattedCase.petitionPaymentStatus} ${paymentDate} ${paymentMethod}`;

  const caseEntity = new Case(preformattedCase, { authorizedUser });
  const canConsolidate = caseEntity.canConsolidate(caseEntity);
  const canUnconsolidate = !!caseEntity.leadDocketNumber;
  const caseTitle = Case.getCaseTitle(preformattedCase.caseCaption || '');
  const correspondence = preformattedCase.correspondence.map(doc => ({
    ...doc,
    formattedFilingDate: formatDateString(doc.filingDate, 'MMDDYY'),
  }));

  const createdAtFormatted = formatDateString(
    preformattedCase.createdAt,
    'MMDDYY',
  );
  const formattedPreferredTrialCity =
    preformattedCase.preferredTrialCity || 'No location selected';

  const showNotScheduled = !preformattedCase.trialSessionId;

  const showBlockedFromTrial =
    !!preformattedCase.blocked &&
    preformattedCase.status !== CASE_STATUS_TYPES.calendared;

  const blockedDateFormatted = formatDateString(
    preformattedCase.blockedDate,
    'MMDDYY',
  );

  const formattedTrialCity = preformattedCase.trialSessionId
    ? preformattedCase.trialLocation || 'Not assigned'
    : 'Not assigned';

  let formattedTrialDate = 'Not scheduled';

  if (preformattedCase.trialSessionId && preformattedCase.trialDate) {
    if (preformattedCase.trialTime) {
      formattedTrialDate = formatDateString(
        combineISOandEasternTime(
          preformattedCase.trialDate,
          preformattedCase.trialTime,
        ),
        FORMATS.DATE_TIME,
      );
    } else {
      formattedTrialDate = formatDateString(
        preformattedCase.trialDate,
        FORMATS.MMDDYY,
      );
    }
  }

  const irsPractitioners =
    preformattedCase.irsPractitioners?.map(counsel =>
      formatCounsel({ caseDetail: preformattedCase, counsel }),
    ) ?? [];
  const pendingItemsDocketEntries = formattedDocketEntries.filter(de =>
    DocketEntry.isPending(de),
  );
  const privatePractitioners =
    preformattedCase.privatePractitioners?.map(counsel =>
      formatCounsel({ caseDetail: preformattedCase, counsel }),
    ) ?? [];

  if (preformattedCase.hearings && preformattedCase.hearings.length) {
    preformattedCase.hearings.forEach(hearing => {
      Object.assign(
        hearing,
        formattedTrialSessionDetails({
          judgeName: hearing.judge && hearing.judge.name,
          trialDate: hearing.startDate,
          trialLocation: hearing.trialLocation,
          trialTime: hearing.startTime,
        }),
      );
    });
  }
  return {
    ...preformattedCase,
    blockedDateFormatted,
    canConsolidate,
    canUnconsolidate,
    caseTitle,
    consolidatedIconTooltipText: inConsolidatedGroup
      ? caseIsLeadCase
        ? 'Lead case'
        : 'Consolidated case'
      : '',
    correspondence,
    createdAtFormatted,
    draftDocuments,
    draftDocumentsUnsorted,
    filingFee,
    formattedAssociatedJudge: preformattedCase.trialSessionId
      ? preformattedCase.associatedJudge || 'Not assigned'
      : '',
    formattedDocketEntries,
    formattedPreferredTrialCity,
    formattedTrialCity,
    formattedTrialDate,
    inConsolidatedGroup,
    irsNoticeDateFormatted: preformattedCase.irsNoticeDate
      ? formatDateString(preformattedCase.irsNoticeDate, 'MMDDYY')
      : 'No notice provided',
    irsPractitioners,
    irsSendDate: caseEntity.getIrsSendDate() || '',
    isConsolidatedSubCase,
    isLeadCase: caseIsLeadCase,
    isSealed: isSealedCase(preformattedCase),
    paymentDate,
    paymentMethod,
    pendingItemsDocketEntries,
    privatePractitioners,
    receivedAtFormatted: formatDateString(
      preformattedCase.receivedAt,
      'MMDDYY',
    ),
    showBlockedFromTrial,
    showNotScheduled,
    showPrintConfirmationLink:
      !!caseEntity.getIrsSendDate() &&
      !preformattedCase.docketEntries.some(de => !!de.isLegacy),
    showScheduled:
      !!preformattedCase.trialSessionId &&
      preformattedCase.status !== CASE_STATUS_TYPES.calendared,
    shouldShowIrsNoticeDate: !!preformattedCase.hasVerifiedIrsNotice,
    showTrialCalendared:
      !!preformattedCase.trialSessionId &&
      preformattedCase.status === CASE_STATUS_TYPES.calendared,
    trialLocation: preformattedCase.trialSessionId
      ? preformattedCase.trialLocation || ''
      : '',
    trialTime: preformattedCase.trialSessionId
      ? preformattedCase.trialTime || ''
      : '',
  };
};

const byIndexSortFunction = (a, b) => {
  if (!a.index && !b.index) {
    return 0;
  } else if (!a.index) {
    return 1;
  } else if (!b.index) {
    return -1;
  }
  return a.index - b.index;
};

const getDocketRecordSortFunc = sortByString => {
  const byDate = (a, b) => {
    const compared = calculateDifferenceInDays(a.filingDate, b.filingDate);
    if (compared === 0) {
      return byIndexSortFunction(a, b);
    }
    return compared;
  };

  switch (sortByString) {
    case 'byIndex': // fall-through
    case 'byIndexDesc':
      return byIndexSortFunction;
    case 'byDate': // fall through, is the default sort method
    case 'byDateDesc':
    default:
      return byDate;
  }
};

const formatCounsel = ({ caseDetail, counsel }) => {
  let formattedName = counsel.name;

  if (counsel.barNumber) {
    formattedName += ` (${counsel.barNumber})`;
  }
  counsel.formattedName = formattedName;

  if (counsel.representing) {
    counsel.representingFormatted = [];

    caseDetail.petitioners.forEach(p => {
      if (counsel.representing.includes(p.contactId)) {
        counsel.representingFormatted.push({
          name: p.name,
          secondaryName: p.secondaryName,
          title: p.title,
        });
      }
    });
  }

  return counsel;
};

// sort items that do not display a filingDate (based on createdAtFormatted) at the bottom
export const sortUndefined = (
  a: { createdAtFormatted?: string; [key: string]: any },
  b: { createdAtFormatted?: string; [key: string]: any },
) => {
  if (a.createdAtFormatted && !b.createdAtFormatted) {
    return -1;
  }

  if (!a.createdAtFormatted && b.createdAtFormatted) {
    return 1;
  }

  return 0;
};

export const sortDocketEntries = (
  docketEntries: FormattedCaseDetailDocketEntry[],
  sortByString = '',
): FormattedCaseDetailDocketEntry[] => {
  const sortFunc = getDocketRecordSortFunc(sortByString);
  const isReversed = sortByString.includes('Desc');
  docketEntries.sort(sortFunc);
  if (isReversed) {
    // reversing AFTER the sort keeps sorting stable
    return docketEntries.reverse().sort(sortUndefined);
  }
  return docketEntries.sort(sortUndefined);
};

// Used by both front and backend
export const getFormattedCaseDetail = ({
  applicationContext,
  authorizedUser,
  caseDetail,
  docketRecordSort,
}: {
  applicationContext:
    | ServerApplicationContext
    | ClientApplicationContext
    | ClientPublicApplicationContext;
  caseDetail: RawCase;
  docketRecordSort?: string;
  authorizedUser: UnknownAuthUser;
}): FormattedCaseDetail => {
  const formattedCaseDetail = {
    ...setServiceIndicatorsForPetitionersOnCase(caseDetail),
    ...formatCase(applicationContext, caseDetail, authorizedUser),
  };

  return {
    ...formattedCaseDetail,
    formattedDocketEntries: sortDocketEntries(
      formattedCaseDetail.formattedDocketEntries,
      docketRecordSort,
    ),
    docketRecordSort,
  };
};
