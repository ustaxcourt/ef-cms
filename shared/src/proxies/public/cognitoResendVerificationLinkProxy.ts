import { post } from '../requests';

export const cognitoResendVerificationLinkInteractor = (
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
