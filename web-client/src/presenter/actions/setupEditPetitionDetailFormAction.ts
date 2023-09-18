import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the form with the necessary date related state that is found on the caseDetail for petition fee payments.
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setupEditPetitionDetailFormAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);

  store.set(state.form, {
    caseType: caseDetail.caseType,
    hasVerifiedIrsNotice: caseDetail.hasVerifiedIrsNotice,
    petitionPaymentDate: caseDetail.petitionPaymentDate,
    petitionPaymentMethod: caseDetail.petitionPaymentMethod,
    petitionPaymentStatus: caseDetail.petitionPaymentStatus,
    petitionPaymentWaivedDate: caseDetail.petitionPaymentWaivedDate,
    preferredTrialCity: caseDetail.preferredTrialCity,
    procedureType: caseDetail.procedureType,
    statistics: caseDetail.statistics,
  });

  if (caseDetail.irsNoticeDate) {
    const irsNoticeDate = applicationContext
      .getUtilities()
      .formatDateString(caseDetail.irsNoticeDate, FORMATS.YYYYMMDD);

    store.set(state.form.irsNoticeDate, irsNoticeDate);
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
