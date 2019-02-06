import _ from 'lodash';

export default async ({ applicationContext }) => {
  let workItems = await applicationContext
    .getUseCases()
    .getSentWorkItemsForUser({
      applicationContext,
    });
  workItems = _.orderBy(workItems, 'createdAt', 'desc');
  return { workItems };
};
