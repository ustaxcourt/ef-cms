import { state } from 'cerebral';

export const reviewPetitionHelper = (get, applicationContext) => {
  let irsNoticeDateFormatted;
  const {
    hasVerifiedIrsNotice,
    irsNoticeDate,
    mailingDate,
    petitionPaymentStatus,
    receivedAt,
  } = get(state.form);

  const { PAYMENT_STATUS } = applicationContext.getConstants();

  const mailingDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(mailingDate, 'MMDDYYYY');

  const receivedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(receivedAt, 'MMDDYYYY');

  const hasIrsNoticeFormatted = hasVerifiedIrsNotice ? 'Yes' : 'No';

  const shouldShowIrsNoticeDate = hasVerifiedIrsNotice === true;

  const petitionPaymentStatusFormatted =
    petitionPaymentStatus === PAYMENT_STATUS.PAID ? 'Paid' : 'Not Paid';

  if (shouldShowIrsNoticeDate) {
    irsNoticeDateFormatted = applicationContext
      .getUtilities()
      .formatDateString(irsNoticeDate, 'MMDDYYYY');
  }

  return {
    hasIrsNoticeFormatted,
    irsNoticeDateFormatted,
    mailingDateFormatted,
    petitionPaymentStatusFormatted,
    receivedAtFormatted,
    shouldShowIrsNoticeDate,
  };
};
