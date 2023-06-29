import { state } from '@web-client/presenter/app.cerebral';

/**
 * mark a case as unsealed
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @returns {Promise<object>} the next path based on if update was successful or error
 */
export const unsealCaseAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  let result;
  try {
    result = await applicationContext
      .getUseCases()
      .unsealCaseInteractor(applicationContext, {
        docketNumber,
      });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again',
        title: 'Case could not be unsealed.',
      },
    });
  }

  return path.success({
    alertSuccess: {
      message: 'Case unsealed.',
    },
    caseDetail: result,
  });
};
