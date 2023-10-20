import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';

/**
 * creates new account locally
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess
 */
export const createNewAccountAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { email, name, password } = get(state.form);
  const user = { email, name, password };

  // confirmation code is currently intentionally hard-coded in cognitoLocal
  const confirmationCode = '123456';
  const queryString = qs.stringify(
    { confirmationCode, email },
    { encode: false },
  );

  try {
    await applicationContext
      .getUseCases()
      .createUserCognitoInteractor(applicationContext, {
        user,
      });
    return path.yes({
      alertSuccess: {
        linkText: 'Verify Email',
        linkUrl: `/confirm-signup-local?${queryString}`,
        message: `New user account created successfully for ${email}! Please click the link below to verify your email address.`,
        newTab: false,
      },
    });
  } catch (e) {
    return path.no({
      alertError: {
        message: `New user account could not be created for ${email}`,
      },
    });
  }
};
