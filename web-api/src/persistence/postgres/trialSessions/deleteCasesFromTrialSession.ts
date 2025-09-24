import { pgDeleteFrom } from '../utils/operation/pgDeleteFrom';

export const deleteCasesFromTrialSession = async ({
  docketNumbers,
  trialSessionId,
}: {
  docketNumbers: string[];
  trialSessionId: string;
}): Promise<void> => {
  if (!docketNumbers.length) return;
  
  await pgDeleteFrom({
    table: 'dwTrialSessionCase',
    where: cb =>
      cb
        .where('trialSessionId', '=', trialSessionId)
        .where('docketNumber', 'in', docketNumbers),
  });
};
