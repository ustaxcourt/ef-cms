import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';

export const createConfirmLinkLocal = async ({ get, path }: ActionProps) => {
  if (process.env.STAGE === 'local') {
    const { email } = get(state.form);

    // confirmation code is currently intentionally hard-coded in cognitoLocal
    const confirmationCode = '123456';
    const queryString = qs.stringify(
      { confirmationCode, email },
      { encode: false },
    );

    const confirmationLink = `/confirm-signup-local?${queryString}`;

    return path.yes({
      alertSuccess: {
        alertType: 'success',
        message: `New user account created successfully for ${email}! Please click the link below to verify your email address. /n 
        <a href="${confirmationLink}">log in here</a>.`,
        title: 'Account Created Locally',
      },
    });
  }
};
