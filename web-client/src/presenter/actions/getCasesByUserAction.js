import { state } from 'cerebral';
import _ from 'lodash';

export default async ({ applicationContext, get }) => {
  const useCases = applicationContext.getUseCases();
  const userId = get(state.user.userId);
  let caseList;
  caseList = await useCases.getCasesByUser({
    applicationContext,
    userId,
  });
  caseList = _.orderBy(caseList, 'createdAt', 'desc');
  return { caseList };
};
