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
