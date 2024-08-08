import { createApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';
import {
  getDestinationTableInfo,
  getUserPoolId,
  requireEnvVars,
} from '../../shared/admin-tools/util';
import { User } from '../../shared/src/business/entities/User';
import { Role } from '../../shared/src/business/entities/EntityConstants';

requireEnvVars(['ENV']);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext();

  // used to set testable email on lower envs
  // const email = process.argv[2];

  const email = 'judge.way@ustaxcourt.gov';
  const judgeFullName = 'Kashi Way';
  const name = 'Way';
  const section = 'waysChambers';

  const isSeniorJudge = false;
  const judgeTitle = 'Judge';
  const role = 'judge';
  const userId = applicationContext.getUniqueId();

  const userPoolId = await getUserPoolId();

  environment.userPoolId = userPoolId;
  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  const cognitoCall: {
    email: string;
    role: Role;
    name: string;
    userId: string;
    poolId?: string;
    temporaryPassword?: string;
    sendWelcomeEmail: boolean;
  } = {
    email,
    role,
    name,
    userId,
    poolId: userPoolId,
    sendWelcomeEmail: true,
  };

  const dynamoUserInfo = {
    email,
    role,
    name,
    userId,
    judgeFullName,
    section,
    judgeTitle,
    isSeniorJudge,
  };

  await applicationContext
    .getUserGateway()
    .createUser(applicationContext, cognitoCall);

  const rawUser = new User(dynamoUserInfo).validate().toRawObject();

  await applicationContext.getPersistenceGateway().createUserRecords({
    applicationContext,
    user: rawUser,
    userId: rawUser.userId,
  });
})();
