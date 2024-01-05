import qs from 'qs';

export const createConfirmLinkAction = ({ props }: ActionProps) => {
  if (!process.env.IS_LOCAL) return;

  const { userId, confirmationCode, email } = props;

  // confirmation code is currently intentionally hard-coded in cognitoLocal
  // ^^ it is not, have to set process.env.CODE
  const queryString = qs.stringify(
    { confirmationCode, userId },
    { encode: false },
  );

  const confirmationLink = `http://localhost:1234/confirm-signup?${queryString}`;

  return {
    alertSuccess: {
      alertType: 'success',
      message: `New user account created successfully for ${email}! Please click the link below to verify your email address. </br><a rel="noopener noreferrer" href="${confirmationLink}">Verify Email Address</a>`,
      title: 'Account Created Locally',
    },
  };
};
