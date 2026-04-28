import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const completeWorkItemInteractor = (
  applicationContext: ClientApplicationContext,
  {
    completedMessage,
    workItemId,
  }: { completedMessage?: string; workItemId: string },
) => {
  return put({
    applicationContext,
    body: { completedMessage },
    endpoint: `/work-items/${workItemId}/complete`,
  });
};
