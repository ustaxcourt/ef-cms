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
    endpoint: '/account/resend-verification',
  });
};
