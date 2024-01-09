import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { NewPetitionerUser } from '@shared/business/entities/NewPetitionerUser';
import { SES } from 'aws-sdk';
import { ServerApplicationContext } from '@web-api/applicationContext';
import qs from 'qs';

export type SignUpUserResponse = {
  email: string;
  userId: string;
  confirmationCode?: string;
};

export const signUpUserInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    user,
  }: {
    user: {
      password: string;
      name: string;
      email: string;
      confirmPassword: string;
    };
  },
): Promise<SignUpUserResponse> => {
  const cognito: CognitoIdentityProvider = applicationContext.getCognito();

  const { Users: existingAccounts } = await cognito.listUsers({
    AttributesToGet: ['email'],
    Filter: `email = "${user.email}"`,
    UserPoolId: process.env.USER_POOL_ID,
  });

  if (existingAccounts?.length) {
    const accountUnconfirmed = existingAccounts.some(
      acct => acct.UserStatus === 'UNCONFIRMED',
    );

    const errorMessage = accountUnconfirmed
      ? 'User exists, email unconfirmed'
      : 'User already exists';

    throw new Error(errorMessage);
  }

  const newUser = new NewPetitionerUser(user).validate().toRawObject();

  const result = await cognito.signUp({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Password: newUser.password,
    UserAttributes: [
      {
        Name: 'email',
        Value: newUser.email,
      },
      {
        Name: 'name',
        Value: newUser.name,
      },
    ],
    Username: newUser.email,
  });

  const userId = result.UserSub!;

  const { confirmationCode } = await applicationContext
    .getPersistenceGateway()
    .generateAccountConfirmationCode(applicationContext, { userId });

  await sendAccountCreationConfirmation(applicationContext, {
    confirmationCode,
    email: newUser.email,
    userId,
  });

  const signUpUserResponse: SignUpUserResponse = {
    email: user.email,
    userId,
  };

  // Only return confirmationCode locally as we cannot send an email. Do not expose confirmation code in deployed env.
  if (applicationContext.environment.stage === 'local') {
    signUpUserResponse.confirmationCode = confirmationCode;
  }

  return signUpUserResponse;
};

const sendAccountCreationConfirmation = async (
  applicationContext: ServerApplicationContext,
  {
    confirmationCode,
    email,
    userId,
  }: { email: string; confirmationCode: string; userId: string },
) => {
  const queryString = qs.stringify(
    { confirmationCode, userId },
    { encode: false },
  );
  const verificationLink = `https://app.${process.env.EFCMS_DOMAIN}/confirm-signup?${queryString}`;

  const emailBody =
    'Welcome to DAWSON! Your account with DAWSON has been created. Use the' +
    ' button below to verify your email address.' +
    `<button style="font-family: Source Sans Pro Web,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif;
    font-size: 1.06rem;
    line-height: .9;
    color: #fff;
    background-color: #005ea2;
    border: 0;
    border-radius: 0.25rem;
    cursor: pointer;
    display: inline-block;
    margin-right: 0.5rem;
    padding: .75rem 2.25rem;
    text-align: center;
    text-decoration: none;"><a href="${verificationLink}">Verify Email</a></button>` +
    '<br><br><br>If you did not create an account with DAWSON, please contact support at ' +
    '<a href="mailto:dawson.support@ustaxcourt.gov">dawson.support@ustaxcourt.gov</a>.';

  const emailClient: SES = applicationContext.getEmailClient();

  return await emailClient
    .sendEmail({
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Data: emailBody,
          },
        },
        Subject: {
          Data: 'U.S. Tax Court DAWSON Account Verification',
        },
      },
      Source: process.env.EMAIL_SOURCE!,
    })
    .promise();
};
