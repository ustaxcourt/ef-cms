import { post } from '../requests';

export const resendVerificationLinkInteractor = (
  applicationContext,
  { email },
) => {
  return post({
    applicationContext,
    body: {
      email,
    },
    endpoint: '/auth/account/resend-verification',
  });
};
