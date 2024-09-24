import { RawUser } from '@shared/business/entities/User';
import { createApplicationContext } from '@web-api/applicationContext';
import { createOrUpdateUser } from 'shared/admin-tools/user/admin';
import { environment } from '@web-api/environment';
import {
  getDestinationTableInfo,
  getUserPoolId,
  requireEnvVars,
} from '../../shared/admin-tools/util';
import { getNewPasswordForEnvironment } from './make-new-password';
import { judgeUser } from '@shared/test/mockUsers';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import joi from 'joi';

requireEnvVars(['ENV', 'DEFAULT_ACCOUNT_PASS']);

interface UserParamsInterface {
  email: string;
  name: string;
  role: string;
  section: string;
}

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

// We create the context as a judge user to have permissions to access the chambers interactor
const applicationContext = createApplicationContext(judgeUser);

const checkParams = ({
  params,
  validChambersSections,
}: {
  params: UserParamsInterface;
  validChambersSections: string[];
}) => {
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
          ...validChambersSections,
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

export const sendWelcomeEmail = async ({ email }) => {
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
  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  const judgeUsers: RawUser[] = await applicationContext
    .getUseCases()
    .getUsersInSectionInteractor(
      applicationContext,
      { section: 'judge' },
      mockJudgeUser,
    );
  const validChambersSections = judgeUsers.map(user => user.section!);
  const params: UserParamsInterface = {
    email: process.argv[2],
    name: process.argv[3],
    role: process.argv[4],
    section: process.argv[5],
  };
  checkParams({ params, validChambersSections });
  environment.userPoolId = await getUserPoolId();
  await createOrUpdateUser(applicationContext, {
    password: getNewPasswordForEnvironment(),
    setPasswordAsPermanent: true,
    user: { ...params },
  });
  await sendWelcomeEmail({ email: params.email });
})();
