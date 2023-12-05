import { state } from '@web-client/presenter/app.cerebral';
/**
 * submits the edit deficiency statistics form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success or error path
 */
export const submitEditDeficiencyStatisticAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const {
    determinationDeficiencyAmount,
    determinationTotalPenalties,
    irsDeficiencyAmount,
    irsTotalPenalties,
    lastDateOfPeriod,
    penalties,
    statisticId,
    year,
    yearOrPeriod,
  } = get(state.form);

  const docketNumber = get(state.caseDetail.docketNumber);

  try {
    await applicationContext
      .getUseCases()
      .updateDeficiencyStatisticInteractor(applicationContext, {
        determinationDeficiencyAmount,
        determinationTotalPenalties,
        docketNumber,
        irsDeficiencyAmount,
        irsTotalPenalties,
        lastDateOfPeriod,
        penalties,
        statisticId,
        year,
        yearOrPeriod,
      });

    let successMessageDate;

    if (yearOrPeriod === 'Year') {
      successMessageDate = year;
    } else {
      successMessageDate = applicationContext
        .getUtilities()
        .formatDateString(lastDateOfPeriod, 'MMDDYY');
    }

    return path.success({
      alertSuccess: {
        message: `${successMessageDate} statistics updated.`,
      },
    });
  } catch (e) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Statistic could not be edited.',
      },
    });
  }
};
