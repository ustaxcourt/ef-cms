import { state } from 'cerebral';

export const reviewSavedPetitionHelper = (get, applicationContext) => {
  let irsNoticeDateFormatted;

  const {
    documents,
    hasVerifiedIrsNotice,
    irsNoticeDate,
    petitionPaymentDate,
    petitionPaymentMethod,
    petitionPaymentStatus,
    preferredTrialCity,
    receivedAt,
    ...caseDetail
  } = get(state.form);

  const {
    INITIAL_DOCUMENT_TYPES,
    PAYMENT_STATUS,
  } = applicationContext.getConstants();

  const receivedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(receivedAt, 'MMDDYYYY');

  const hasIrsNoticeFormatted = hasVerifiedIrsNotice ? 'Yes' : 'No';

  const shouldShowIrsNoticeDate = hasVerifiedIrsNotice === true;

  const petitionPaymentStatusFormatted =
    petitionPaymentStatus === PAYMENT_STATUS.PAID
      ? `Paid ${applicationContext
          .getUtilities()
          .formatDateString(
            petitionPaymentDate,
            'MMDDYYYY',
          )} ${petitionPaymentMethod}`
      : 'Not paid';

  const preferredTrialCityFormatted = preferredTrialCity
    ? preferredTrialCity
    : 'No requested place of trial';

  if (shouldShowIrsNoticeDate) {
    irsNoticeDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(irsNoticeDate, 'MMDDYYYY');
  }

  const documentsByType = (documents || []).reduce((acc, document) => {
    acc[document.documentType] = document;
    return acc;
  }, {});

  // orders needed summary
  const hasOrders = [
    'orderForAmendedPetition',
    'orderForAmendedPetitionAndFilingFee',
    'orderForFilingFee',
    'orderForOds',
    'orderForRatification',
    // TODO: see OrdersNeededSummary.jsx
    // 'orderDesignatingPlaceOfTrial',
    'orderToShowCause',
    'noticeOfAttachments',
  ].some(key => Boolean(caseDetail[key]));

  const petitionFile =
    documentsByType[INITIAL_DOCUMENT_TYPES.petition.documentType];
  const requestForPlaceOfTrialFile =
    documentsByType[INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType];
  const ownershipDisclosureFile =
    documentsByType[INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType];
  const stinFile = documentsByType[INITIAL_DOCUMENT_TYPES.stin.documentType];

  return {
    hasIrsNoticeFormatted,
    hasOrders,
    irsNoticeDateFormatted,
    ownershipDisclosureFile,
    petitionFile,
    petitionPaymentStatusFormatted,
    preferredTrialCityFormatted,
    receivedAtFormatted,
    requestForPlaceOfTrialFile,
    shouldShowIrsNoticeDate,
    stinFile,
  };
};
