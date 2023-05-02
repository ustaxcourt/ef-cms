import { state } from 'cerebral';
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
}) => {
  const { email, name, password } = get(state.form);

  const user = { email, name, password };
  const successfulResult = await applicationContext
    .getUseCases()
    .createUserInteractorLocal(applicationContext, {
      user,
    });

  // confirmation code is currently intentionally hard-coded in cognitoLocal
  const confirmationCode = '123456';

  const queryString = qs.stringify(
    { confirmationCode, email },
    { encode: false },
  );

  if (successfulResult) {
    return path.yes({
      alertSuccess: {
        linkText: 'Verify Email',
        linkUrl: `/confirm-signup-local?${queryString}`,
        message: `New user account created successfully for ${email}! Please click the link below to verify your email address.`,
        newTab: false,
      },
    });
  } else {
    return path.no({
      alertError: {
        message: `New user account could not be created for ${email}`,
      },
    });
  }
};
