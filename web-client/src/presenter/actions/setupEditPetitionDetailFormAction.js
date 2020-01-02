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
  const paymentStatus = get(state.constants.PAYMENT_STATUS);

  store.set(state.form.petitionPaymentStatus, caseDetail.petitionPaymentStatus);

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
};
