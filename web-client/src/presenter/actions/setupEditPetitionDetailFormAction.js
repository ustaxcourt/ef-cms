import { state } from 'cerebral';

/**
 * sets the state.caseDetail which is used for displaying the red alerts at the top of the page.
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
  }
};
