import { state } from 'cerebral';
import _ from 'lodash';

export default async ({ applicationContext, get }) => {
  let caseList = await applicationContext.getUseCases().getCasesByStatus({
    applicationContext,
    userId: get(state.user.token),
    status: 'new',
  });
  caseList = _.orderBy(caseList, 'createdAt', 'asc');
  return { caseList };
};
