import { remove } from '../requests';

export const deleteCounselFromCaseInteractor = (
  applicationContext,
  { docketNumber, userId }: { docketNumber: string; userId: string },
): Promise<void> => {
  return remove({
    applicationContext,
    endpoint: `/case-parties/${docketNumber}/counsel/${userId}`,
  });
};
