import { state } from 'cerebral';

/**
 * sets the form's dates (split into month/day/year) based on the caseDetail provided in state.caseDetail
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the state.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.form
 */
export const setFormForCaseAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = props.caseDetail || get(state.caseDetail);
  const irsNoticeDate = applicationContext
    .getUtilities()
    .prepareDateFromString(caseDetail.irsNoticeDate, 'YYYY/MM/DD');
  if (
    irsNoticeDate &&
    irsNoticeDate.toDate() instanceof Date &&
    !isNaN(irsNoticeDate.toDate())
  ) {
    store.set(state.form.irsMonth, irsNoticeDate.format('M'));
    store.set(state.form.irsDay, irsNoticeDate.format('D'));
    store.set(state.form.irsYear, irsNoticeDate.format('YYYY'));
  }

  const receivedAt = applicationContext
    .getUtilities()
    .prepareDateFromString(caseDetail.receivedAt, 'YYYY/MM/DD');
  if (
    caseDetail.isPaper &&
    receivedAt &&
    receivedAt.toDate() instanceof Date &&
    !isNaN(receivedAt.toDate())
  ) {
    store.set(state.form.receivedAtMonth, receivedAt.format('M'));
    store.set(state.form.receivedAtDay, receivedAt.format('D'));
    store.set(state.form.receivedAtYear, receivedAt.format('YYYY'));
  }

  const petitionPaymentDate = applicationContext
    .getUtilities()
    .prepareDateFromString(caseDetail.petitionPaymentDate, 'YYYY/MM/DD');
  if (
    petitionPaymentDate &&
    petitionPaymentDate.toDate() instanceof Date &&
    !isNaN(petitionPaymentDate.toDate())
  ) {
    store.set(state.form.paymentDateMonth, petitionPaymentDate.format('M'));
    store.set(state.form.paymentDateDay, petitionPaymentDate.format('D'));
    store.set(state.form.paymentDateYear, petitionPaymentDate.format('YYYY'));
  }

  const petitionPaymentWaivedDate = applicationContext
    .getUtilities()
    .prepareDateFromString(caseDetail.petitionPaymentWaivedDate, 'YYYY/MM/DD');
  if (
    petitionPaymentWaivedDate &&
    petitionPaymentWaivedDate.toDate() instanceof Date &&
    !isNaN(petitionPaymentWaivedDate.toDate())
  ) {
    store.set(
      state.form.paymentDateWaivedMonth,
      petitionPaymentWaivedDate.format('M'),
    );
    store.set(
      state.form.paymentDateWaivedDay,
      petitionPaymentWaivedDate.format('D'),
    );
    store.set(
      state.form.paymentDateWaivedYear,
      petitionPaymentWaivedDate.format('YYYY'),
    );
  }

  if (caseDetail.statistics) {
    caseDetail.statistics.forEach((statistic, index) => {
      if (statistic.lastDateOfPeriod) {
        const lastDateOfPeriod = applicationContext
          .getUtilities()
          .prepareDateFromString(statistic.lastDateOfPeriod, 'YYYY/MM/DD');
        if (
          lastDateOfPeriod &&
          lastDateOfPeriod.toDate() instanceof Date &&
          !isNaN(lastDateOfPeriod.toDate())
        ) {
          store.set(
            state.form.statistics[index].lastDateOfPeriodMonth,
            lastDateOfPeriod.format('M'),
          );
          store.set(
            state.form.statistics[index].lastDateOfPeriodDay,
            lastDateOfPeriod.format('D'),
          );
          store.set(
            state.form.statistics[index].lastDateOfPeriodYear,
            lastDateOfPeriod.format('YYYY'),
          );
        }
      }
    });
  }
};
