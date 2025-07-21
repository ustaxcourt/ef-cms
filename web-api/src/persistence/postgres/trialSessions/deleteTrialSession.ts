import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deleteTrialSession = async ({
  trialSessionId,
}: {
  trialSessionId: string;
}) => {
  await pgDeleteFrom({
    table: 'dwTrialSession',
    where: cb =>
      cb.where('trialSessionId', '=', trialSessionId),
  });
};
