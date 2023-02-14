import { getCaseDeadlineFromFormAction } from './getCaseDeadlineFromFormAction';

/**
 * validates the petition.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.props the cerebral props object
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateCaseDeadlineAction = ({
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

  const errors = applicationContext
    .getUseCases()
    .validateCaseDeadlineInteractor(applicationContext, {
      caseDeadline,
    });

  if (!errors) {
    return path.success();
  } else {
    const errorDisplayOrder = ['docketNumber', 'deadlineDate', 'description'];
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errorDisplayOrder,
      errors,
    });
  }
};
