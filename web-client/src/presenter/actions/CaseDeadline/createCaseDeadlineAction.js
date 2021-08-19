import { getCaseDeadlineFromFormAction } from './getCaseDeadlineFromFormAction';

/**
 * creates a case deadline
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.props the cerebral props object
 * @returns {Promise<*>} the success path
 */
export const createCaseDeadlineAction = async ({
  applicationContext,
  get,
  path,
  props,
}) => {
  const caseDeadline = getCaseDeadlineFromFormAction({
    applicationContext,
    get,
    props,
  });

  let createCaseDeadlineResult = await applicationContext
    .getUseCases()
    .createCaseDeadlineInteractor(applicationContext, {
      caseDeadline,
    });

  return path.success({
    alertSuccess: {
      message: 'Deadline saved.',
    },
    caseDeadline: createCaseDeadlineResult,
  });
};
