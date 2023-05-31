import { state } from 'cerebral';

/**
 * validate the stamp fields on the Apply Stamp form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {object} providers.get the cerebral get function used for getting state.form
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateStampAction = ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const stampMotionForm = get(state.form);

  const errors = applicationContext
    .getUseCases()
    .validateStampInteractor(applicationContext, {
      stampMotionForm,
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
