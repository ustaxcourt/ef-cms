import { state } from 'cerebral';

/**
 * mark a case as sealed
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @returns {Promise<object>} the next path based on if update was successful or error
 */
export const sealCaseAction = async ({ applicationContext, get, path }) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  let result;
  try {
    result = await applicationContext
      .getUseCases()
      .sealCaseInteractor(applicationContext, {
        docketNumber,
      });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again',
        title: 'Case could not be sealed.',
      },
    });
  }

  return path.success({
    alertSuccess: {
      message: 'Case sealed.',
    },
    caseDetail: result,
  });
};
