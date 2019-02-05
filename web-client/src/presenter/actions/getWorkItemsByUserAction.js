import { state } from 'cerebral';
import _ from 'lodash';

export default async ({ applicationContext, get }) => {
  const userId = get(state.user.userId);
  let workItems = await applicationContext.getUseCases().getWorkItems({
    applicationContext,
    userId,
  });
  workItems = _.orderBy(workItems, 'createdAt', 'desc');
  return { workItems };
};
