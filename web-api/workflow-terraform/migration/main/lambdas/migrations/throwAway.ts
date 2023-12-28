import { createApplicationContext } from '@web-api/applicationContext';

const appContext = createApplicationContext();
(async function () {
  const judgeUser = await appContext
    .getPersistenceGateway()
    .getAllUsersByRole(appContext, ['judge', 'legacyJudge']);
  const judgesMap = judgeUser.reduce(
    (accumulator, judge) => {
      accumulator[judge.name] = judge.userId;
      return accumulator;
    },
    {} as { [key: string]: string },
  );
  console.log('judgesMap', judgesMap);
})();
