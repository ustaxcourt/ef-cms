import { getCaseDeadlineFromForm } from './getCaseDeadlineFromForm';

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
export const updateCaseDeadlineAction = ({
  applicationContext,
  get,
  path,
  props,
}) => {
  const caseDeadline = getCaseDeadlineFromForm({
    applicationContext,
    get,
    props,
  });

  let updateCaseDeadlineResult = applicationContext
    .getUseCases()
    .updateCaseDeadlineInteractor({
      applicationContext,
      caseDeadline,
    });

  return path.success({
    alertSuccess: {
      message: 'You can view it in the Sent tab on your Message Queue.',
      title: 'Your message was created successfully.',
    },
    caseDeadline: updateCaseDeadlineResult,
  });
};
