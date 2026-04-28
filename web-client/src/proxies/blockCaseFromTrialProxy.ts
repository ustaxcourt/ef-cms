import { post } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const blockCaseFromTrialInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, reason },
) => {
  return post({
    applicationContext,
    body: { reason },
    endpoint: `/case-meta/${docketNumber}/block`,
  });
};
