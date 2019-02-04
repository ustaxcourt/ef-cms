import _ from 'lodash';

export default async ({ applicationContext }) => {
  const useCases = applicationContext.getUseCases();

  let workItems = await useCases.getSentWorkItemsForUser({
    applicationContext,
  });
  workItems = _.orderBy(workItems, 'createdAt', 'desc');
  return { workItems };
};
