import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const assignWorkItemsInteractor = (
  applicationContext: ClientApplicationContext,
  {
    assigneeId,
    assigneeName,
    workItem = undefined,
    workItemId = undefined,
  }: {
    assigneeId: string;
    assigneeName: string;
    workItem?: object;
    workItemId?: string;
  },
) => {
  return put({
    applicationContext,
    body: {
      assigneeId,
      assigneeName,
      workItem,
      workItemId,
    },
    endpoint: '/work-items',
  });
};
