import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const deleteDeficiencyStatisticInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, statisticId },
) => {
  return remove({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/statistics/${statisticId}`,
  });
};
