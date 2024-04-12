import { createApplicationContext } from '@web-api/applicationContext';
import { createOrUpdateUser } from 'shared/admin-tools/user/admin';
import { environment } from '@web-api/environment';
import {
  getDestinationTableName,
  getUserPoolId,
  requireEnvVars,
} from '../../shared/admin-tools/util';
import joi from 'joi';

requireEnvVars(['ENV', 'DEFAULT_ACCOUNT_PASS']);

const usage = error => {
  if (error) {
    console.log(`\nERROR: ${error}\n`);
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

    - EFCMS_DOMAIN: The URL to access the environment where we are creating a user
    - DEPLOYING_COLOR: The color to which we are deploying
    - USTC_ADMIN_USER: The user we use to perform administrative actions
    - USTC_ADMIN_PASS: The password of the user we use to perform administrative actions\n`);
  process.exit();
};

const applicationContext = createApplicationContext({});

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

const sendWelcomeEmail = async ({ email }) => {
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const params = {
    email: process.argv[2],
    name: process.argv[3],
    role: process.argv[4],
    section: process.argv[5],
  };
  checkParams(params);
  environment.userPoolId = await getUserPoolId();
  environment.dynamoDbTableName = await getDestinationTableName();
  await createOrUpdateUser(applicationContext, {
    password: environment.defaultAccountPass,
    user: params,
  });
  await sendWelcomeEmail({ email: params.email });
})();
