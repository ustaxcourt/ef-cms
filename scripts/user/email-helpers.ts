import { environment } from '@web-api/environment';

export const sendWelcomeEmail = async ({ applicationContext, email }) => {
  try {
    await applicationContext.getCognito().adminCreateUser({
      MessageAction: 'RESEND',
      UserPoolId: environment.userPoolId,
      Username: email.toLowerCase(),
    });
  } catch (err) {
    console.error('Error sending welcome email', err);
  }
};
