/*
This is an example script for setting up MFA for the irs super user.

This script isn't actually used in any manual or automated deploy process.
*/

const readline = require('readline');
const { CognitoIdentityServiceProvider } = require('aws-sdk');

const cognito = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

const ClientId = '5aatnhmbjcq2lhdcqc9r4mvaok';
const email = 'service.agent.test@irs.gov';

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

  response = await cognito
    .initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        PASSWORD: 'WelcomeToFlavortown!',
        USERNAME: email,
      },
      ClientId,
    })
    .promise();
  console.log('logged in');

  if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
    await cognito
      .respondToAuthChallenge({
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeResponses: {
          NEW_PASSWORD: 'WelcomeToFlavortown!',
          USERNAME: email,
        },
        ClientId,
        Session: response.Session,
      })
      .promise();
  }

  console.log('password changed');

  response = await cognito
    .initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        PASSWORD: 'WelcomeToFlavortown!',
        USERNAME: email,
      },
      ClientId,
    })
    .promise();

  console.log('logged in second time');

  if (response.ChallengeName === 'MFA_SETUP') {
    response = await cognito
      .associateSoftwareToken({
        Session: response.Session,
      })
      .promise();

    console.log('associate software');
    console.log('your secret code: ', response.SecretCode);

    const UserCode = await askQuestion('enter your MFA code\n');

    response = await cognito
      .verifySoftwareToken({
        Session: response.Session,
        UserCode,
      })
      .promise();
  }
  return response;
};

const login = async () => {
  let response = await cognito
    .initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        PASSWORD: 'WelcomeToFlavortown!',
        USERNAME: email,
      },
      ClientId,
    })
    .promise();

  console.log(response);

  if (response.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
    const mfa = await askQuestion('enter your MFA code\n');
    response = await cognito
      .respondToAuthChallenge({
        ChallengeName: 'SOFTWARE_TOKEN_MFA',
        ChallengeResponses: {
          SOFTWARE_TOKEN_MFA_CODE: mfa,
          USERNAME: email,
        },
        ClientId,
        Session: response.Session,
      })
      .promise();
    console.log(response);
  }
};

const main = async () => {
  await registerUser();
  await login();
};
main();
