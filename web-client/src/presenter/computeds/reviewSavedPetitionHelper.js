import { formatStatistic } from './statisticsHelper';
import { state } from 'cerebral';

export const ordersAndNoticesNeededCodes = {
  orderDesignatingPlaceOfTrial: 'Order Designating Place of Trial',
  orderForAmendedPetition: 'Order for Amended Petition',
  orderForAmendedPetitionAndFilingFee:
    'Order for Amended Petition and Filing Fee',
  orderForOds: 'Order for Ownership Disclosure Statement',
  orderForRatification: 'Order for Ratification of Petition',
  orderToShowCause: 'Order to Show Cause',
};

export const ordersAndNoticesInDraftsCodes = {
  noticeOfAttachments: 'Notice of Attachments in the Nature of Evidence',
  orderForFilingFee: 'Order for Filing Fee',
};

export const reviewSavedPetitionHelper = (get, applicationContext) => {
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

  const { INITIAL_DOCUMENT_TYPES, PAYMENT_STATUS } =
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
  const ownershipDisclosureFile =
    documentsByType[INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType];
  const stinFile = documentsByType[INITIAL_DOCUMENT_TYPES.stin.documentType];
  const applicationForWaiverOfFilingFeeFile =
    documentsByType[
      INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType
    ];

  const showStatistics = statistics && statistics.length > 0;

  const formattedStatistics = (statistics || []).map(statistic =>
    formatStatistic({ applicationContext, statistic }),
  );

  return {
    applicationForWaiverOfFilingFeeFile,
    formattedStatistics,
    hasIrsNoticeFormatted,
    irsNoticeDateFormatted,
    ordersAndNoticesInDraft,
    ordersAndNoticesNeeded,
    ownershipDisclosureFile,
    petitionFile,
    petitionPaymentStatusFormatted,
    preferredTrialCityFormatted,
    receivedAtFormatted,
    requestForPlaceOfTrialFile,
    shouldShowIrsNoticeDate,
    showStatistics,
    stinFile,
  };
};
