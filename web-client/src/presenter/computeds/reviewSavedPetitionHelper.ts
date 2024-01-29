import { formatStatistic } from './statisticsHelper';
import { state } from '@web-client/presenter/app.cerebral';

export const ordersAndNoticesNeededCodes = {
  orderForCds: 'Order for Corporate Disclosure Statement',
  orderForRatification: 'Order for Ratification of Petition',
};

export const ordersAndNoticesInDraftsCodes = {
  noticeOfAttachments: 'Notice of Attachments in the Nature of Evidence',
  orderDesignatingPlaceOfTrial: 'Order Designating Place of Trial',
  orderForAmendedPetition: 'Order for Amended Petition',
  orderForAmendedPetitionAndFilingFee:
    'Order for Amended Petition and Filing Fee',
  orderForFilingFee: 'Order for Filing Fee',
  orderToShowCause: 'Order to Show Cause',
};

const getEConsentAttributesForContact = (
  contact: any = {},
): { eServiceConsentText: string; shouldDisplayEConsentText: boolean } => {
  const shouldDisplayEConsentText =
    !!contact.paperPetitionEmail || contact.hasConsentedToEService;

  const eServiceConsentText = contact.hasConsentedToEService
    ? 'E-service consent'
    : 'No e-service consent';

  return { eServiceConsentText, shouldDisplayEConsentText };
};

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const reviewSavedPetitionHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  let irsNoticeDateFormatted;

  const {
    docketEntries,
    hasVerifiedIrsNotice,
    irsNoticeDate,
    petitionPaymentDate,
    petitionPaymentMethod,
    petitionPaymentStatus,
    petitionPaymentWaivedDate,
    preferredTrialCity,
    receivedAt,
    statistics,
    ...caseDetail
  } = get(state.form);

  const { ALLOWLIST_FEATURE_FLAGS, INITIAL_DOCUMENT_TYPES, PAYMENT_STATUS } =
    applicationContext.getConstants();

  const receivedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(receivedAt, 'MMDDYY');

  const hasIrsNoticeFormatted = hasVerifiedIrsNotice ? 'Yes' : 'No';

  const shouldShowIrsNoticeDate = hasVerifiedIrsNotice === true;

  let petitionPaymentStatusFormatted;
  switch (petitionPaymentStatus) {
    case PAYMENT_STATUS.PAID:
      petitionPaymentStatusFormatted = `Paid ${applicationContext
        .getUtilities()
        .formatDateString(
          petitionPaymentDate,
          'MMDDYY',
        )} ${petitionPaymentMethod}`;
      break;
    case PAYMENT_STATUS.WAIVED:
      petitionPaymentStatusFormatted = `Waived ${applicationContext
        .getUtilities()
        .formatDateString(petitionPaymentWaivedDate, 'MMDDYY')}`;
      break;
    default:
      petitionPaymentStatusFormatted = PAYMENT_STATUS.UNPAID;
  }

  const preferredTrialCityFormatted =
    preferredTrialCity || 'No requested place of trial';

  if (shouldShowIrsNoticeDate) {
    irsNoticeDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(irsNoticeDate, 'MMDDYY');
  }

  const documentsByType = (docketEntries || [])
    .filter(d => !d.isMinuteEntry)
    .reduce((acc, docketEntry) => {
      acc[docketEntry.documentType] = docketEntry;
      return acc;
    }, {});

  const ordersAndNoticesNeededCodesSelected = Object.keys(
    ordersAndNoticesNeededCodes,
  ).filter(order => Boolean(caseDetail[order]));

  const ordersAndNoticesInDraftCodesSelected = Object.keys(
    ordersAndNoticesInDraftsCodes,
  ).filter(order => Boolean(caseDetail[order]));

  const ordersAndNoticesNeeded = [];
  const ordersAndNoticesInDraft = [];

  for (const [key, value] of Object.entries(ordersAndNoticesNeededCodes)) {
    if (ordersAndNoticesNeededCodesSelected.includes(key)) {
      ordersAndNoticesNeeded.push(value);
    }
  }

  for (const [key, value] of Object.entries(ordersAndNoticesInDraftsCodes)) {
    if (ordersAndNoticesInDraftCodesSelected.includes(key)) {
      ordersAndNoticesInDraft.push(value);
    }
  }

  const petitionFile =
    documentsByType[INITIAL_DOCUMENT_TYPES.petition.documentType];
  const requestForPlaceOfTrialFile =
    documentsByType[INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType];
  const corporateDisclosureFile =
    documentsByType[INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType];
  const stinFile = documentsByType[INITIAL_DOCUMENT_TYPES.stin.documentType];
  const applicationForWaiverOfFilingFeeFile =
    documentsByType[
      INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType
    ];

  const attachmentToPetitionFiles = docketEntries.filter(
    docketEntry => docketEntry.eventCode === 'ATP',
  );

  const showStatistics = statistics && statistics.length > 0;

  const formattedStatistics = (statistics || []).map(statistic =>
    formatStatistic({ applicationContext, statistic }),
  );

  const renderOrderSummary =
    ordersAndNoticesNeeded.length > 0 || ordersAndNoticesInDraft.length > 0;
  const showOrdersAndNoticesNeededHeader = ordersAndNoticesNeeded.length > 0;
  const showOrdersAndNoticesInDraftHeader = ordersAndNoticesInDraft.length > 0;

  const eConsentFieldsEnabledFeatureFlag = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key
    ],
  );

  let shouldDisplayEConsentTextForPrimaryContact;
  let shouldDisplayEConsentTextForSecondaryContact;
  let eServiceConsentTextForPrimaryContact;
  let eServiceConsentTextForSecondaryContact;
  if (eConsentFieldsEnabledFeatureFlag) {
    ({
      eServiceConsentText: eServiceConsentTextForPrimaryContact,
      shouldDisplayEConsentText: shouldDisplayEConsentTextForPrimaryContact,
    } = getEConsentAttributesForContact(caseDetail.contactPrimary));

    if (caseDetail.contactSecondary) {
      ({
        eServiceConsentText: eServiceConsentTextForSecondaryContact,
        shouldDisplayEConsentText: shouldDisplayEConsentTextForSecondaryContact,
      } = getEConsentAttributesForContact(caseDetail.contactSecondary));
    }
  }

  return {
    applicationForWaiverOfFilingFeeFile,
    attachmentToPetitionFiles,
    corporateDisclosureFile,
    eConsentFieldsEnabledFeatureFlag,
    eServiceConsentTextForPrimaryContact,
    eServiceConsentTextForSecondaryContact,
    formattedStatistics,
    hasIrsNoticeFormatted,
    irsNoticeDateFormatted,
    ordersAndNoticesInDraft,
    ordersAndNoticesNeeded,
    petitionFile,
    petitionPaymentStatusFormatted,
    preferredTrialCityFormatted,
    receivedAtFormatted,
    renderOrderSummary,
    requestForPlaceOfTrialFile,
    shouldDisplayEConsentTextForPrimaryContact,
    shouldDisplayEConsentTextForSecondaryContact,
    shouldShowIrsNoticeDate,
    showOrdersAndNoticesInDraftHeader,
    showOrdersAndNoticesNeededHeader,
    showStatistics,
    stinFile,
  };
};
