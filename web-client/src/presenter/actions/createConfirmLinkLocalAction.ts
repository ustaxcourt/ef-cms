import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';

export const createConfirmLinkLocal = ({ get }: ActionProps) => {
  if (!process.env.IS_LOCAL) return;

  const { email } = get(state.form);

  // confirmation code is currently intentionally hard-coded in cognitoLocal
  const confirmationCode = '123456';
  const queryString = qs.stringify(
    { confirmationCode, email },
    { encode: false },
  );

  const confirmationLink = `/confirm-signup-local?${queryString}`;

  return {
    alertSuccess: {
      alertType: 'success',
      message: `New user account created successfully for ${email}! Please click the link below to verify your email address. </br>
        <a rel="noopener noreferrer" href="${confirmationLink}">Verify Email Address</a>.`,
      title: 'Account Created Locally',
    },
  };
};
