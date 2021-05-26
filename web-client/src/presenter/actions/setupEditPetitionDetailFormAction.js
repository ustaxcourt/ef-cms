import { state } from 'cerebral';

/**
 * sets the form with the necessary date related state that is found on the caseDetail for petition fee payments.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setupEditPetitionDetailFormAction = ({
  applicationContext,
  get,
  store,
}) => {
  const caseDetail = get(state.caseDetail);
  const paymentStatus = applicationContext.getConstants().PAYMENT_STATUS;

  store.set(state.form, {
    caseType: caseDetail.caseType,
    hasVerifiedIrsNotice: caseDetail.hasVerifiedIrsNotice,
    petitionPaymentStatus: caseDetail.petitionPaymentStatus,
    preferredTrialCity: caseDetail.preferredTrialCity,
    procedureType: caseDetail.procedureType,
    statistics: caseDetail.statistics,
  });

  if (caseDetail.petitionPaymentStatus === paymentStatus.WAIVED) {
    const [
      paymentDateWaivedYear,
      paymentDateWaivedMonth,
      paymentDateWaivedDay,
    ] = applicationContext
      .getUtilities()
      .formatDateString(caseDetail.petitionPaymentWaivedDate, 'YYYY-MM-DD')
      .split('-');

    store.set(state.form.paymentDateWaivedYear, paymentDateWaivedYear);
    store.set(state.form.paymentDateWaivedMonth, paymentDateWaivedMonth);
    store.set(state.form.paymentDateWaivedDay, paymentDateWaivedDay);
  } else if (caseDetail.petitionPaymentStatus === paymentStatus.PAID) {
    const [
      paymentDateYear,
      paymentDateMonth,
      paymentDateDay,
    ] = applicationContext
      .getUtilities()
      .formatDateString(caseDetail.petitionPaymentDate, 'YYYY-MM-DD')
      .split('-');

    store.set(state.form.paymentDateYear, paymentDateYear);
    store.set(state.form.paymentDateMonth, paymentDateMonth);
    store.set(state.form.paymentDateDay, paymentDateDay);

    store.set(
      state.form.petitionPaymentMethod,
      caseDetail.petitionPaymentMethod,
    );
  }

  if (caseDetail.irsNoticeDate) {
    const [
      irsYear,
      irsMonth,
      irsDay,
    ] = applicationContext
      .getUtilities()
      .formatDateString(caseDetail.irsNoticeDate, 'YYYY-MM-DD')
      .split('-');

    store.set(state.form.irsYear, irsYear);
    store.set(state.form.irsMonth, irsMonth);
    store.set(state.form.irsDay, irsDay);
  }

  if (caseDetail.statistics) {
    caseDetail.statistics.forEach((statistic, index) => {
      if (statistic.lastDateOfPeriod) {
        const deconstructedLastDateOfPeriod = applicationContext
          .getUtilities()
          .deconstructDate(statistic.lastDateOfPeriod);

        if (deconstructedLastDateOfPeriod) {
          store.set(
            state.form.statistics[index].lastDateOfPeriodMonth,
            deconstructedLastDateOfPeriod.month,
          );
          store.set(
            state.form.statistics[index].lastDateOfPeriodDay,
            deconstructedLastDateOfPeriod.day,
          );
          store.set(
            state.form.statistics[index].lastDateOfPeriodYear,
            deconstructedLastDateOfPeriod.year,
          );
        }
      }
    });
  }
};
