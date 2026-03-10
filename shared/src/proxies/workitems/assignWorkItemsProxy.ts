import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { put } from '../requests';

export const assignWorkItemsInteractor = (
  applicationContext,
  {
    assigneeId,
    assigneeName,
    workItem = undefined,
    workItemId = undefined,
  }: {
    assigneeId: string;
    assigneeName: string;
    workItemId?: string;
    workItem?: RawWorkItem;
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
