import { combineLastDateOfPeriodFields } from './StartCaseInternal/computeStatisticDatesAction';
import { state } from 'cerebral';
/**
 * submits the add deficiency statistics form
 *
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
}) => {
  const {
    determinationDeficiencyAmount,
    determinationTotalPenalties,
    irsDeficiencyAmount,
    irsTotalPenalties,
    lastDateOfPeriod,
    year,
    yearOrPeriod,
  } = combineLastDateOfPeriodFields({
    applicationContext,
    form: get(state.form),
  });

  const { caseId } = get(state.caseDetail);

  try {
    await applicationContext.getUseCases().addDeficiencyStatisticInteractor({
      applicationContext,
      caseId,
      determinationDeficiencyAmount,
      determinationTotalPenalties,
      irsDeficiencyAmount,
      irsTotalPenalties,
      lastDateOfPeriod,
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
        title: 'Errors were found. Please correct your form and resubmit.',
      },
    });
  }
};
