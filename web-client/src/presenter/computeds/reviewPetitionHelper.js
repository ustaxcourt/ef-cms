import { state } from 'cerebral';

export const reviewPetitionHelper = (get, applicationContext) => {
  let irsNoticeDateFormatted;
  const {
    dateReceived,
    hasVerifiedIrsNotice,
    irsNoticeDate,
    mailingDate,
    petitionPaymentStatus,
  } = get(state.form);

  const { PAYMENT_STATUS } = applicationContext.getConstants();

  const mailingDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(mailingDate, 'MMDDYYYY');

  const receivedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(dateReceived, 'MMDDYYYY');

  const hasIrsNoticeFormatted = hasVerifiedIrsNotice ? 'Yes' : 'No';

  const shouldShowIrsNoticeDate = hasVerifiedIrsNotice === true;

  const petitionPaymentStatusFormatted =
    petitionPaymentStatus === PAYMENT_STATUS.PAID ? 'Paid' : 'Not paid';

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
