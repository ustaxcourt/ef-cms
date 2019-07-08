import { state } from 'cerebral';

/**
 * resets the state.form which is used throughout the app for storing html form values
 * state.form is used throughout the app for storing html form values
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get helper function
 * @param {object} providers.path the next object in the path
 * @returns {object} the success path
 */
export const deleteCaseDeadlineAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const caseId = get(state.caseDetail.caseId);
  const caseDeadlineId = get(state.form.caseDeadlineId);

  await applicationContext.getUseCases().deleteCaseDeadlineInteractor({
    applicationContext,
    caseDeadlineId,
    caseId,
  });

  return path.success({
    alertSuccess: {
      message: 'You can view it in the Sent tab on your Message Queue.',
      title: 'Your message was created successfully.',
    },
  });
};
