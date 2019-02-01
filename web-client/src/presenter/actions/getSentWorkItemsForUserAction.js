import { state } from 'cerebral';
import _ from 'lodash';

export default async ({ applicationContext, get }) => {
  const useCases = applicationContext.getUseCases();
  const userId = get(state.user.userId);
  let workItems = await useCases.getSentWorkItemsForUser({
    applicationContext,
    userId,
  });
  workItems = _.orderBy(workItems, 'createdAt', 'desc');
  return { workItems };
};
