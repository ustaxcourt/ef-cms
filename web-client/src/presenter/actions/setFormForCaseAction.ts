import { state } from 'cerebral';

/**
 * sets the form's dates (split into month/day/year) based on the caseDetail provided in state.caseDetail
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the state.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.form
 */
export const setFormForCaseAction = ({
  applicationContext,
  get,
  props,
  store,
}) => {
  const caseDetail = props.caseDetail || get(state.caseDetail);

  const deconstructedIrsNoticeDate = applicationContext
    .getUtilities()
    .deconstructDate(caseDetail.irsNoticeDate);

  if (deconstructedIrsNoticeDate) {
    store.set(state.form.irsMonth, deconstructedIrsNoticeDate.month);
    store.set(state.form.irsDay, deconstructedIrsNoticeDate.day);
    store.set(state.form.irsYear, deconstructedIrsNoticeDate.year);
  }

  const deconstructedReceivedAt = applicationContext
    .getUtilities()
    .deconstructDate(caseDetail.receivedAt);

  if (caseDetail.isPaper && deconstructedReceivedAt) {
    store.set(state.form.receivedAtMonth, deconstructedReceivedAt.month);
    store.set(state.form.receivedAtDay, deconstructedReceivedAt.day);
    store.set(state.form.receivedAtYear, deconstructedReceivedAt.year);
  }

  const deconstructedPetitionPaymentDate = applicationContext
    .getUtilities()
    .deconstructDate(caseDetail.petitionPaymentDate);

  if (deconstructedPetitionPaymentDate) {
    store.set(
      state.form.paymentDateMonth,
      deconstructedPetitionPaymentDate.month,
    );
    store.set(state.form.paymentDateDay, deconstructedPetitionPaymentDate.day);
    store.set(
      state.form.paymentDateYear,
      deconstructedPetitionPaymentDate.year,
    );
  }

  const deconstructedPetitionPaymentWaivedDate = applicationContext
    .getUtilities()
    .deconstructDate(caseDetail.petitionPaymentWaivedDate);

  if (deconstructedPetitionPaymentWaivedDate) {
    store.set(
      state.form.paymentDateWaivedMonth,
      deconstructedPetitionPaymentWaivedDate.month,
    );
    store.set(
      state.form.paymentDateWaivedDay,
      deconstructedPetitionPaymentWaivedDate.day,
    );
    store.set(
      state.form.paymentDateWaivedYear,
      deconstructedPetitionPaymentWaivedDate.year,
    );
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
