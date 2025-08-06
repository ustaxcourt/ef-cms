import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';
import { settlePromises } from '@web-api/utilities/settlePromises';

export const deleteTrialSession = async ({
  trialSessionId,
}: {
  trialSessionId: string;
}): Promise<void>  => {
  await settlePromises([
    pgDeleteFrom({
      table: 'dwTrialSessionCase',
      where: cb => cb.where('trialSessionId', '=', trialSessionId),
    }),

    pgDeleteFrom({
      table: 'dwTrialSession',
      where: cb => cb.where('trialSessionId', '=', trialSessionId),
    }),
  ]);
};
