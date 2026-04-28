import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const setWorkItemAsReadInteractor = (
  applicationContext: ClientApplicationContext,
  { workItemId },
) => {
  return post({
    applicationContext,
    endpoint: `/work-items/${workItemId}/read`,
  });
};
