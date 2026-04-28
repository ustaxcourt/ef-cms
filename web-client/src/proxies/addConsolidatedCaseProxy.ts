import { put } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const addConsolidatedCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, docketNumberToConsolidateWith },
) => {
  return put({
    applicationContext,
    body: { docketNumberToConsolidateWith },
    endpoint: `/case-meta/${docketNumber}/consolidate-case`,
  });
};
