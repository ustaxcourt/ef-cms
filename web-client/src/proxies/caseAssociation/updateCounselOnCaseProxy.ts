import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateCounselOnCaseInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, userData, userId },
) => {
  return put({
    applicationContext,
    body: { ...userData },
    endpoint: `/case-parties/${docketNumber}/counsel/${userId}`,
  });
};
