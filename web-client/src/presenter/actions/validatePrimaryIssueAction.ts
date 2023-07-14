import { state } from '@web-client/presenter/app.cerebral';

/**
 * validate the case or session note
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @returns {object} the next path based on if validation was successful or error
 */
export const validatePrimaryIssueAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const primaryIssue = {
    ...get(state.modal),
  };

  const errors = applicationContext
    .getUseCases()
    .validatePrimaryIssueInteractor(applicationContext, {
      primaryIssue,
    });

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
      errors,
    });
  }
};
