// see ../docs/additional-resources/irs-super-user.md for detailed instructions

const { requireEnvVars } = require('../shared/admin-tools/util');
requireEnvVars([
  'DEFAULT_ACCOUNT_PASS',
  'IRS_CLIENT_ID',
  'IRS_SUPERUSER_EMAIL',
]);

const readline = require('readline');
const {
  AssociateSoftwareTokenCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  VerifySoftwareTokenCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

const cognito = new CognitoIdentityProviderClient({
  region: 'us-east-1',
});

const ClientId = process.env.IRS_CLIENT_ID;
const email = process.env.IRS_SUPERUSER_EMAIL;
const password = process.env.DEFAULT_ACCOUNT_PASS;

const askQuestion = query => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close();
      resolve(ans);
    }),
  );
};

const registerUser = async () => {
  let response;

  const initiateAuthCommand = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      PASSWORD: password,
      USERNAME: email,
    },
    ClientId,
  });
  response = await cognito.send(initiateAuthCommand);
  console.log('logged in');

  if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
    console.log('new password required...');
    const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ChallengeResponses: {
        NEW_PASSWORD: password,
        USERNAME: email,
      },
      ClientId,
      Session: response.Session,
    });
    await cognito.send(respondToAuthChallengeCommand);
    console.log('password changed');
  }

  response = await cognito.send(initiateAuthCommand);
  console.log('logged in second time');

  if (response.ChallengeName === 'MFA_SETUP') {
    const associateSoftwareTokenCommand = new AssociateSoftwareTokenCommand({
      Session: response.Session,
    });
    response = await cognito.send(associateSoftwareTokenCommand);

    console.log('associate software');
    console.log('your secret code: ', response.SecretCode);

    const UserCode = await askQuestion('enter your MFA code\n');

    const verifySoftwareTokenCommand = new VerifySoftwareTokenCommand({
      Session: response.Session,
      UserCode,
    });
    response = await cognito.send(verifySoftwareTokenCommand);
  }
  return response;
};

const login = async () => {
  let response;

  const initiateAuthCommand = new InitiateAuthCommand({
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      PASSWORD: password,
      USERNAME: email,
    },
    ClientId,
  });

  response = await cognito.send(initiateAuthCommand);
  console.log(response);

  if (response.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
    const mfa = await askQuestion('enter your MFA code\n');
    const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
      ChallengeName: 'SOFTWARE_TOKEN_MFA',
      ChallengeResponses: {
        SOFTWARE_TOKEN_MFA_CODE: mfa,
        USERNAME: email,
      },
      ClientId,
      Session: response.Session,
    });
    response = await cognito.send(respondToAuthChallengeCommand);
    console.log(response);
  }
};

const main = async () => {
  await registerUser();
  await login();
};
main();
