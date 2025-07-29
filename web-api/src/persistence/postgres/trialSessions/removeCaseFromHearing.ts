import { pgDeleteFrom } from '../utils/operation/pgDeleteFrom';

export const removeCaseFromHearing = async ({
  docketNumber,
  trialSessionId,
}: {
  docketNumber: string;
  trialSessionId: string;
}): Promise<void> => {
  await pgDeleteFrom({
    table: 'dwCaseHearing',
    where: cb =>
      cb
        .where('trialSessionId', '=', trialSessionId)
        .where('docketNumber', '=', docketNumber),
  });
};
