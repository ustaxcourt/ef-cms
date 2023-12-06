import { state } from '@web-client/presenter/app.cerebral';
/**
 * submits the add deficiency statistics form
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success or error path
 */
export const submitAddDeficiencyStatisticsAction = async ({
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
    year,
    yearOrPeriod,
  } = get(state.form);
  const docketNumber = get(state.caseDetail.docketNumber);

  try {
    await applicationContext
      .getUseCases()
      .addDeficiencyStatisticInteractor(applicationContext, {
        determinationDeficiencyAmount,
        determinationTotalPenalties,
        docketNumber,
        irsDeficiencyAmount,
        irsTotalPenalties,
        lastDateOfPeriod,
        penalties,
        year,
        yearOrPeriod,
      });

    return path.success({
      alertSuccess: {
        message: 'Year/Period added.',
      },
    });
  } catch (e) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Statistic could not be added.',
      },
    });
  }
};
