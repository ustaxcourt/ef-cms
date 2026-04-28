import { remove } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const unblockCaseFromTrialInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber },
) => {
  return remove({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/block`,
  });
};
