import qs from 'qs';

export const createConfirmLinkAction = ({ props }: ActionProps) => {
  if (!process.env.IS_LOCAL) return;

  const { email } = props;

  // confirmation code is currently intentionally hard-coded in cognitoLocal
  // ^^ it is not, have to set process.env.CODE
  const confirmationCode = '123456';
  const queryString = qs.stringify(
    { confirmationCode, email },
    { encode: false },
  );

  const confirmationLink = `/confirm-signup?${queryString}`;

  return {
    alertSuccess: {
      alertType: 'success',
      message: `New user account created successfully for ${email}! Please click the link below to verify your email address. </br><a rel="noopener noreferrer" href="${confirmationLink}">Verify Email Address</a>`,
      title: 'Account Created Locally',
    },
  };
};
