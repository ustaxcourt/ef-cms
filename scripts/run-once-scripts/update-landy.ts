import { createApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';
import {
  getDestinationTableInfo,
  getUserPoolId,
  requireEnvVars,
} from '../../shared/admin-tools/util';
import { User } from '../../shared/src/business/entities/User';

requireEnvVars(['ENV']);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  // 'stjudge.landy@ustaxcourt.gov'; // OLD
  // 'judge.landy@ustaxcourt.gov'; // NEW

  const oldEmail = process.argv[2];
  const newEmail = process.argv[3];

  const applicationContext = createApplicationContext();
  const userPoolId = await getUserPoolId();

  environment.userPoolId = userPoolId;
  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  const { userId } = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      poolId: userPoolId,
      email: oldEmail,
    });

  const dynamoLandyUserInfo = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId,
    });

  dynamoLandyUserInfo.email = newEmail;
  dynamoLandyUserInfo.judgeTitle = 'Judge';
  const rawUser = new User(dynamoLandyUserInfo).validate().toRawObject();

  await applicationContext.getUserGateway().updateUser(applicationContext, {
    attributesToUpdate: {
      email: newEmail,
    },
    email: oldEmail,
    poolId: userPoolId,
  });

  await applicationContext.getPersistenceGateway().createUserRecords({
    applicationContext,
    user: rawUser,
    userId: rawUser.userId,
  });
})();
