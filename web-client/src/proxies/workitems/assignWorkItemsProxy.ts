import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const assignWorkItemsInteractor = (
  applicationContext: ClientApplicationContext,
  {
    assigneeId,
    assigneeName,
    workItem = undefined,
    workItemIds = undefined,
  }: {
    assigneeId: string;
    assigneeName: string;
    workItem?: RawWorkItem;
    workItemIds?: string[];
  },
): Promise<void> => {
  return put({
    applicationContext,
    body: {
      assigneeId,
      assigneeName,
      workItem,
      workItemIds,
    },
    endpoint: '/work-items',
  });
};
