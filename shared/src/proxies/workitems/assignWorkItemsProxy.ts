import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { put } from '../requests';

export const assignWorkItemsInteractor = (
  applicationContext,
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
) => {
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
