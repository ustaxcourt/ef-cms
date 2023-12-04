import { createApplicationContext } from '@web-api/applicationContext';
import { getPendingMotionDocketEntriesForCurrentJudgeInteractor } from '@shared/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';

const params = {
  judge: 'Carluzzo',
};

(async function () {
  const startTime = new Date();
  await getPendingMotionDocketEntriesForCurrentJudgeInteractor(
    createApplicationContext(),
    params,
  );

  const endTime = new Date();
  const elapsedTimeInSeconds = (endTime - startTime) / 1000;

  console.log(`Execution time: ${elapsedTimeInSeconds} seconds`);
})();
