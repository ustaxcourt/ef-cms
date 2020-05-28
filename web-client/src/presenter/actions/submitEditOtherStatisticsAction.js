import { state } from 'cerebral';
/**
 * submits the edit other statistics form
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success or error path
 */
export const submitEditOtherStatisticsAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { damages, litigationCosts } = get(state.form);
  const { caseId } = get(state.caseDetail);

  try {
    await applicationContext.getUseCases().updateOtherStatisticsInteractor({
      applicationContext,
      caseId,
      damages,
      litigationCosts,
    });
    return path.success({
      alertSuccess: {
        message: 'Other statistics updated.',
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
