import { User } from '@shared/business/entities/User';
import { requireEnvVars } from '../../shared/admin-tools/util';
requireEnvVars(['ENV', 'REGION', 'DYNAMODB_TABLE_NAME']);
import { createApplicationContext } from '@web-api/applicationContext';

/**
How to Run:

npx ts-node --transpile-only scripts/judgeUpdates/update-senior-judges.ts
*/

// ******************************** INPUTS ******************************
const judgesToUpdateIds: { userId: string; judgeTitle: string }[] = [
  {
    judgeTitle: 'EXAMPLE',
    userId: '111111-11111-1111-111111-111111',
  },
];
// **********************************************************************

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  for (let judge of judgesToUpdateIds) {
    const { userId } = judge;

    const userToUpdate = await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId });
    const userEntity = new User(userToUpdate);
    userEntity.judgeTitle = judge.judgeTitle;

    await applicationContext.getPersistenceGateway().updateUser({
      applicationContext,
      user: userEntity.validate().toRawObject(),
    });
  }
})();
