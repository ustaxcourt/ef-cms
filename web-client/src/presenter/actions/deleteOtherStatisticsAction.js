import { state } from 'cerebral';

/**
 * clears the other statistics off the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.path the next object in the path
 * @returns {Promise<*>} the success or error path
 */
export const deleteOtherStatisticsAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  try {
    await applicationContext
      .getUseCases()
      .updateOtherStatisticsInteractor(applicationContext, {
        damages: null,
        docketNumber,
        litigationCosts: null,
      });
    return path.success({
      alertSuccess: {
        message: 'Other statistics deleted.',
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
