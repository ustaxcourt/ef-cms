import { state } from 'cerebral';

export const reviewPetitionFromPaperHelper = (get, applicationContext) => {
  let irsNoticeDateFormatted;
  const {
    dateReceived,
    hasVerifiedIrsNotice,
    irsNoticeDate,
    petitionPaymentStatus,
    preferredTrialCity,
    ...form
  } = get(state.form);

  const { PAYMENT_STATUS } = applicationContext.getConstants();

  const receivedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(dateReceived, 'MMDDYYYY');

  const hasIrsNoticeFormatted = hasVerifiedIrsNotice ? 'Yes' : 'No';

  const shouldShowIrsNoticeDate = hasVerifiedIrsNotice === true;

  const petitionPaymentStatusFormatted =
    petitionPaymentStatus === PAYMENT_STATUS.PAID ? 'Paid' : 'Not paid';

  const preferredTrialCityFormatted = preferredTrialCity
    ? preferredTrialCity
    : 'No requested place of trial';

  if (shouldShowIrsNoticeDate) {
    irsNoticeDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(irsNoticeDate, 'MMDDYYYY');
  }

  // orders needed summary
  let hasOrders = [
    'orderForAmendedPetition',
    'orderForAmendedPetitionAndFilingFee',
    'orderForFilingFee',
    'orderForOds',
    'orderForRatification',
    'orderDesignatingPlaceOfTrial',
    'orderToShowCause',
    'noticeOfAttachments',
  ].some(key => Boolean(form[key]));

  return {
    hasIrsNoticeFormatted,
    hasOrders,
    irsNoticeDateFormatted,
    petitionPaymentStatusFormatted,
    preferredTrialCityFormatted,
    receivedAtFormatted,
    shouldShowIrsNoticeDate,
  };
};
