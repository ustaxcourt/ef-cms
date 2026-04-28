import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const deleteCounselFromCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, userId }: { docketNumber: string; userId: string },
): Promise<void> => {
  return remove({
    applicationContext,
    endpoint: `/case-parties/${docketNumber}/counsel/${userId}`,
  });
};
