#!/usr/bin/env -S npx ts-node --transpile-only
/* eslint-disable prefer-destructuring */

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import { environment } from '@web-api/environment';
import { getCognito } from '@web-api/persistence/cognito/getCognito';
import { ACCOUNT_STATUS } from '@shared/business/entities/EntityConstants';
import { getConnection } from '@web-api/getConnection';

const scriptConfig: ScriptConfig = {
  description:
    'add-account-status-to-users - This script will look at cognito and update postgres dwUser.accountStatus depending on if their account is active or not',
  environment: {
    env: 'ENV',
    userPoolId: 'USER_POOL_ID',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

async function main() {
  const cognito = getCognito();

  let PaginationToken: string | undefined;
  let usersCompleted = 0;
  do {
    const response = await cognito.listUsers({
      Limit: 60,
      PaginationToken,
      UserPoolId: environment.userPoolId,
    });

    PaginationToken = response.PaginationToken;
    const userIds = (response.Users ?? [])
      .filter(user => !user.Enabled)
      .map(user => {
        const userId = user.Attributes?.find(
          element => element.Name === 'custom:userId',
        )?.Value!;
        return userId;
      });

    if (userIds.length) {
      // Not using getDbWriter as we do not want to update opensearch currently.
      await getConnection({
        cb: db =>
          db
            .updateTable('dwUser')
            .set('accountStatus', ACCOUNT_STATUS.inactive)
            .where('userId', 'in', userIds)
            .execute(),
      });
    }

    usersCompleted = usersCompleted + 60;
    console.log('Users Completed: ', usersCompleted);
  } while (PaginationToken);
}

void main();
