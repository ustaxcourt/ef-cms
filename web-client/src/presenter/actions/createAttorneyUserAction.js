import { state } from 'cerebral';

/**
 * creates an attorney user from the given form data
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 */

export const createAttorneyUserAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const user = get(state.form);

  try {
    const attorneyUser = await applicationContext
      .getUseCases()
      .createAttorneyUserInteractor({
        applicationContext,
        user,
      });
    return path.success({
      alertSuccess: {
        message:
          'The user has been notified via the email addressed provided that they can no login to the system. You may continue creating Attorney Users with the form below.',
        title: 'The Attorney User has been added.',
      },
      attorneyUser,
    });
  } catch (err) {
    return path.error();
  }
};
