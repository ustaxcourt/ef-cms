import { state } from 'cerebral';

export const reviewSavedPetitionHelper = (get, applicationContext) => {
  let irsNoticeDateFormatted;

  const form = get(state.form);
  const {
    documents,
    hasVerifiedIrsNotice,
    irsNoticeDate,
    petitionPaymentStatus,
    receivedAt,
  } = form;

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
    petitionPaymentStatus === PAYMENT_STATUS.PAID ? 'Paid' : 'Not paid';

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
    'orderDesignatingPlaceOfTrial',
    'orderToShowCause',
    'noticeOfAttachments',
  ].some(key => Boolean(form[key]));

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
    receivedAtFormatted,
    requestForPlaceOfTrialFile,
    shouldShowIrsNoticeDate,
    stinFile,
  };
};
