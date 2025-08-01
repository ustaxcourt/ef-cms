import { pgDeleteFrom } from '../utils/operation/pgDeleteFrom';

export const removeCaseFromTrialSession = async ({
  docketNumber,
  trialSessionId,
}: {
  docketNumber: string;
  trialSessionId: string;
}): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwTrialSessionCase',
    where: cb =>
      cb
        .where('trialSessionId', '=', trialSessionId)
        .where('docketNumber', '=', docketNumber),
  });
};
