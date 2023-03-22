import { state } from 'cerebral';

/**
 * creates new account locally
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess
 */
export const createNewAccountAction = async ({ applicationContext, get }) => {
  const { email, name, password } = get(state.form);

  const user = { email, name, password };
  const newUser = await applicationContext
    .getUseCases()
    .createUserInteractorLocal(applicationContext, {
      user,
    });

  return {
    alertSuccess: {
      message: `New user account created successfully for ${newUser.email}`,
    },
  };
};
