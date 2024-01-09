import { SignUpUserResponse } from '@web-api/business/useCases/auth/signUpUserInteractor';
import qs from 'qs';

export const createConfirmLinkAction = ({
  props,
}: ActionProps<SignUpUserResponse>) => {
  if (!process.env.IS_LOCAL) return;

  const queryString = qs.stringify(
    { confirmationCode: props.confirmationCode, userId: props.userId },
    { encode: false },
  );

  const confirmationLink = `http://localhost:1234/confirm-signup?${queryString}`;

  return {
    alertSuccess: {
      alertType: 'success',
      message: `New user account created successfully for ${props.email}! Please click the link below to verify your email address. </br><a rel="noopener noreferrer" href="${confirmationLink}">Verify Email Address</a>`,
      title: 'Account Created Locally',
    },
  };
};
