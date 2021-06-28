import { state } from 'cerebral';

/**
 * submits the add/edit other statistics form
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success or error path
 */
export const submitOtherStatisticsAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { damages, isEditing, litigationCosts } = get(state.form);
  const docketNumber = get(state.caseDetail.docketNumber);

  try {
    await applicationContext
      .getUseCases()
      .updateOtherStatisticsInteractor(applicationContext, {
        damages,
        docketNumber,
        litigationCosts,
      });

    let successMessage = 'Other statistics added.';
    if (isEditing) {
      successMessage = 'Other statistics updated.';
    }
    return path.success({
      alertSuccess: {
        message: successMessage,
      },
    });
  } catch (e) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: `Statistic could not be ${isEditing ? 'edited' : 'added'}.`,
      },
    });
  }
};
