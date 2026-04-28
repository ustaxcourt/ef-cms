import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const serveCaseToIrsInteractor = (
  applicationContext: ClientApplicationContext,
  { clientConnectionId, docketNumber },
) => {
  return post({
    applicationContext,
    body: { clientConnectionId },
    endpoint: `/async/cases/${docketNumber}/serve-to-irs`,
  });
};
