import { put } from '../requests';

export const completeWorkItemInteractor = (
  applicationContext,
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
