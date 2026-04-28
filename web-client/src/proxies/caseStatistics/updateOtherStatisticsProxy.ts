import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateOtherStatisticsInteractor = (
  applicationContext: ClientApplicationContext,
  { damages, docketNumber, litigationCosts },
) => {
  return post({
    applicationContext,
    body: { damages, litigationCosts },
    endpoint: `/case-meta/${docketNumber}/other-statistics`,
  });
};
