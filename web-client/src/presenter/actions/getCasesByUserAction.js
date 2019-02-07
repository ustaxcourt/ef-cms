import { state } from 'cerebral';
import _ from 'lodash';

export default async ({ applicationContext, get }) => {
  const userId = get(state.user.userId);
  let caseList = await applicationContext.getUseCases().getCasesByUser({
    applicationContext,
    userId,
  });
  caseList = _.orderBy(caseList, 'createdAt', 'desc');
  return { caseList };
};
