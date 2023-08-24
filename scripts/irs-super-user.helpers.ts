// Usage: see ../docs/additional-resources/irs-super-user.md for detailed instructions

import { askQuestion, requireEnvVars } from '../shared/admin-tools/util';
requireEnvVars([
  'DEFAULT_ACCOUNT_PASS',
  'IRS_CLIENT_ID',
  'IRS_SUPERUSER_EMAIL',
]);

import {
  AssociateSoftwareTokenCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  VerifySoftwareTokenCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const cognito = new CognitoIdentityProviderClient({
  region: 'us-east-1',
});

const ClientId = process.env.IRS_CLIENT_ID;
const email = process.env.IRS_SUPERUSER_EMAIL!;
const password = process.env.DEFAULT_ACCOUNT_PASS!;

const initiateAuthCommand = new InitiateAuthCommand({
  AuthFlow: 'USER_PASSWORD_AUTH',
  AuthParameters: {
    PASSWORD: password,
    USERNAME: email,
  },
  ClientId,
});

export const registerUser = async (): Promise<void> => {
  let authResponse = await cognito.send(initiateAuthCommand);
  console.log('logged in');

  if (authResponse.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
    console.log('new password required...');
    const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        NEW_PASSWORD: password,
        USERNAME: email,
      },
      ClientId,
      Session: authResponse.Session,
    });
    await cognito.send(respondToAuthChallengeCommand);
    console.log('password changed');

    authResponse = await cognito.send(initiateAuthCommand);
    console.log('logged in second time');
  }

  if (authResponse.ChallengeName === 'MFA_SETUP') {
    const associateSoftwareTokenCommand = new AssociateSoftwareTokenCommand({
      Session: authResponse.Session,
    });
    const associateSoftwareTokenResponse = await cognito.send(
      associateSoftwareTokenCommand,
    );

    console.log('associate software');
    console.log(
      'your secret code: ',
      associateSoftwareTokenResponse.SecretCode,
    );

    const UserCode = await askQuestion('enter your MFA code\n');

    const verifySoftwareTokenCommand = new VerifySoftwareTokenCommand({
      Session: associateSoftwareTokenResponse.Session, // authResponse.Session,
      UserCode,
    });
    await cognito.send(verifySoftwareTokenCommand);
    console.log('MFA verified');
  }
};

export const login = async (): Promise<void> => {
  const authResponse = await cognito.send(initiateAuthCommand);
  console.log(authResponse);

  if (authResponse.ChallengeName !== 'SOFTWARE_TOKEN_MFA') {
    console.log('authResponse', authResponse);
    throw new Error(
      'Expected login authResponse to require SOFTWARE_TOKEN_MFA',
    );
  }

  const mfa = await askQuestion('enter your MFA code\n');
  const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
    ChallengeName: 'SOFTWARE_TOKEN_MFA',
    ChallengeResponses: {
      SOFTWARE_TOKEN_MFA_CODE: mfa,
      USERNAME: email,
    },
    ClientId,
    Session: authResponse.Session,
  });
  const authChallengeResponse = await cognito.send(
    respondToAuthChallengeCommand,
  );
  console.log(
    `\nSUCCESS: Use this token to authenticate:\n\n${authChallengeResponse.AuthenticationResult?.IdToken}`,
  );
};
