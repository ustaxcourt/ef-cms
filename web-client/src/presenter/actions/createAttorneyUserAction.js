import { state } from 'cerebral';

/**
 * creates an attorney user from the given form data
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 */

export const createAttorneyUserAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const user = get(state.form);

  try {
    const result = await applicationContext
      .getUseCases()
      .createAttorneyUserInteractor({
        applicationContext,
        user,
      });
    return path.success({ attorneyUser: result });
  } catch (err) {
    return path.error();
  }
};
