import { getCaseDeadlineFromFormAction } from './getCaseDeadlineFromFormAction';

/**
 * resets the state.form which is used throughout the app for storing html form values
 * state.form is used throughout the app for storing html form values
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props object
 * @returns {object} the success path
 */
export const updateCaseDeadlineAction = async ({
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

  let updateCaseDeadlineResult = await applicationContext
    .getUseCases()
    .updateCaseDeadlineInteractor(applicationContext, {
      caseDeadline,
    });

  return path.success({
    alertSuccess: {
      message: 'Deadline updated.',
    },
    caseDeadline: updateCaseDeadlineResult,
  });
};
