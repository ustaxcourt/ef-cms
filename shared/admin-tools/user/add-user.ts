import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import {
  activateAdminAccount,
  createDawsonUser,
  deactivateAdminAccount,
} from './admin';
import { checkEnvVar, getUserPoolId } from '../util';
import joi from 'joi';

const { DEPLOYING_COLOR, EFCMS_DOMAIN, ENV } = process.env;

checkEnvVar(
  EFCMS_DOMAIN,
  'Please have EFCMS_DOMAIN set up in your local environment',
);
checkEnvVar(ENV, 'Please have ENV set up in your local environment');
checkEnvVar(
  DEPLOYING_COLOR,
  'Please have DEPLOYING_COLOR set up in your local environment',
);

const usage = error => {
  if (error) {
    console.log(`\nERROR: ${error}`);
  }

  console.log(`
  Use this script to create a new DAWSON user.

    $ npm run admin:create-user <EMAIL> <NAME> <ROLE> <SECTION>

    - EMAIL: Email address of the user
    - NAME: The full name of the user
    - ROLE: The user's role at the Court
    - SECTION: The section they belong to

  Example:

    $ npm run admin:create-user user@example.com "Test User" admissionsclerk admissions

  Required Environment Variables:

    - ENV: The deployed environment to which we are creating a user
    - EFCMS_DOMAIN: The URL to access the environment where we are creating a user
    - USTC_ADMIN_USER: The user we use to perform administrative actions
    - USTC_ADMIN_PASS: The password of the user we use to perform administrative actions\n`);
  process.exit();
};

const checkParams = params => {
  const schema = joi.object().keys({
    email: joi.string().email().required(),
    name: joi.string().required(),
    role: joi
      .string()
      .valid(
        ...[
          'adc',
          'admissionsclerk',
          'clerkofcourt',
          'docketclerk',
          'petitionsclerk',
          'trialclerk',
          'floater',
          'general',
          'reportersOffice',
          'chambers',
        ],
      ),
    section: joi
      .string()
      .valid(
        ...[
          'adc',
          'admissions',
          'clerkofcourt',
          'docket',
          'petitions',
          'trialClerks',
          'floater',
          'general',
          'reportersOffice',
          'ashfordsChambers',
          'buchsChambers',
          'cohensChambers',
          'colvinsChambers',
          'copelandsChambers',
          'foleysChambers',
          'friedsChambers',
          'galesChambers',
          'goekesChambers',
          'greavesChambers',
          'gustafsonsChambers',
          'halpernsChambers',
          'holmesChambers',
          'jonesChambers',
          'kerrigansChambers',
          'landysChambers',
          'laubersChambers',
          'marshallsChambers',
          'marvelsChambers',
          'morrisonsChambers',
          'negasChambers',
          'parisChambers',
          'pughsChambers',
          'siegelsChambers',
          'thorntonsChambers',
          'torosChambers',
          'urdasChambers',
          'vasquezsChambers',
          'weilersChambers',
          'wellsChambers',
          'carluzzosChambers',
          'guysChambers',
          'leydensChambers',
          'panuthosChambers',
        ],
      ),
  });

  const { error, value } = schema.validate(params);
  if (error) {
    usage(error);
  }
  console.log(value);
  return value;
};

/**
 * Send the welcome email to the email address specified
 *
 * @param {String} email The email we wish to send the welcome email
 */
const sendWelcomeEmail = async email => {
  const cognito = new CognitoIdentityProvider({ region: 'us-east-1' });
  const UserPoolId = await getUserPoolId();
  try {
    await cognito.adminCreateUser({
      MessageAction: 'RESEND',
      UserPoolId,
      Username: email,
    });
  } catch (err) {
    console.error('Error sending welcome email', err);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const params = {
    email: process.argv[2],
    name: process.argv[3],
    role: process.argv[4],
    section: process.argv[5],
  };
  checkParams(params);
  await activateAdminAccount();
  await createDawsonUser({
    deployingColorUrl: `https://api-${DEPLOYING_COLOR}.${EFCMS_DOMAIN}/users`,
    user: params,
  }); // Need to pass in the api url
  await deactivateAdminAccount();
  await sendWelcomeEmail(params.email);
})();
