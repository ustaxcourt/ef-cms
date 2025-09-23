import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deleteTrialSessionWorkingCopy = async ({
  trialSessionId,
  userId,
}: {
  trialSessionId: string;
  userId: string;
}): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwTrialSessionWorkingCopy',
    where: cb =>
      cb
        .where('trialSessionId', '=', trialSessionId)
        .where('userId', '=', userId),
  });
};
