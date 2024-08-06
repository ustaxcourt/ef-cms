// Delete. Terrible.

// Update email in Cognito
// Update Dynamo records
// - User record with judge title and new email
// - User email record
//

import { createApplicationContext } from '@web-api/applicationContext';
import { createOrUpdateUser } from '@shared/admin-tools/user/admin';
import { environment } from '@web-api/environment';
import {
  getDestinationTableInfo,
  getUserPoolId,
  requireEnvVars,
} from '../../shared/admin-tools/util';
import { User } from '../../shared/src/business/entities/User';
import { raw } from 'express';

requireEnvVars(['ENV', 'DEFAULT_ACCOUNT_PASS']);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const CURRENT_EMAIL = 'stjudge.landy@ustaxcourt.gov';
  const UPDATED_EMAIL = 'judge.landy@ustaxcourt.gov';

  const applicationContext = createApplicationContext();
  const userPoolId = await getUserPoolId();

  environment.userPoolId = userPoolId;
  const { tableName } = await getDestinationTableInfo();
  environment.dynamoDbTableName = tableName;

  const dynamoLandyUserInfo = applicationContext
    .getPersistenceGateway()
    .getUserByEmail(applicationContext, {
      email: CURRENT_EMAIL,
      poolId: userPoolId,
    });
  dynamoLandyUserInfo.email = UPDATED_EMAIL;
  dynamoLandyUserInfo.judgeTitle = 'Judge';
  const rawUser = new User(dynamoLandyUserInfo).validate().toRawObject();

  await applicationContext.getUserGateway().updateUser(applicationContext, {
    attributesToUpdate: {
      email: UPDATED_EMAIL,
    },
    email: CURRENT_EMAIL,
    poolId: userPoolId,
  });

  await applicationContext.getPersistenceGateway().createUserRecords({
    applicationContext,
    user: rawUser,
    userId: rawUser.userId,
  });
})();

// Merge code w/ UI based updates
