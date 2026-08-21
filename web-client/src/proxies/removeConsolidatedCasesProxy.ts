import { remove } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const removeConsolidatedCasesInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, docketNumbersToRemove },
): Promise<void> => {
  const docketNumberList = docketNumbersToRemove.join(',');
  return remove({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/consolidate-case?docketNumbersToRemove=${docketNumberList}`,
  });
};
