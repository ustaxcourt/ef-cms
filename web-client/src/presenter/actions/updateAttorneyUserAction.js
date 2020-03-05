import { state } from 'cerebral';

/**
 * updates an attorney user from the given form data
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 */
export const updateAttorneyUserAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const user = get(state.form);

  try {
    const attorneyUser = await applicationContext
      .getUseCases()
      .updateAttorneyUserInteractor({
        applicationContext,
        user,
      });
    return path.success({
      alertSuccess: {
        title: 'The Attorney User has been updated.',
      },
      attorneyUser,
    });
  } catch (err) {
    return path.error();
  }
};
