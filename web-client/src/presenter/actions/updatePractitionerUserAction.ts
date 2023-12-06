import { state } from '@web-client/presenter/app.cerebral';

/**
 * updates a practitioner user from the given form data
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 * @returns {object} path execution results
 */
export const updatePractitionerUserAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const user = get(state.form);

  try {
    await applicationContext
      .getUseCases()
      .updatePractitionerUserInteractor(applicationContext, {
        barNumber: user.barNumber,
        user,
      });
    return path.success({
      alertSuccess: {
        message: 'Practitioner updated.',
      },
    });
  } catch (err) {
    return path.error({
      alertError: {
        message: 'Please try again.',
        title: 'Practitioner could not be edited.',
      },
    });
  }
};
