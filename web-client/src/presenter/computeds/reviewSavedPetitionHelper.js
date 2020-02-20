import { state } from 'cerebral';

export const reviewSavedPetitionHelper = (get, applicationContext) => {
  let irsNoticeDateFormatted;
  const {
    documents,
    hasVerifiedIrsNotice,
    irsNoticeDate,
    petitionPaymentStatus,
    receivedAt,
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
    petitionPaymentStatus === PAYMENT_STATUS.PAID ? 'Paid' : 'Not paid';

  if (shouldShowIrsNoticeDate) {
    irsNoticeDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(irsNoticeDate, 'MMDDYYYY');
  }
  const documentsByType = documents.reduce((acc, document) => {
    acc[document.documentType] = document;
    return acc;
  }, {});

  const petitionFile =
    documentsByType[INITIAL_DOCUMENT_TYPES.petition.documentType];
  const requestForPlaceOfTrialFile =
    documentsByType[INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType];
  const ownershipDisclosureFile =
    documentsByType[INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType];
  const stinFile = documentsByType[INITIAL_DOCUMENT_TYPES.stin.documentType];

  return {
    hasIrsNoticeFormatted,
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
