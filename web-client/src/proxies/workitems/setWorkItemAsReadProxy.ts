import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const setWorkItemAsReadInteractor = (
  applicationContext: ClientApplicationContext,
  { workItemId },
): Promise<RawWorkItem[]> => {
  return post({
    applicationContext,
    endpoint: `/work-items/${workItemId}/read`,
  });
};
