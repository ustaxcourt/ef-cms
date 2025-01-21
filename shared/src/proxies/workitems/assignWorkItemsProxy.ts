import { put } from '../requests';

export const assignWorkItemsInteractor = (
  applicationContext,
  { assigneeId, assigneeName, workItem = undefined, workItemId = undefined },
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
