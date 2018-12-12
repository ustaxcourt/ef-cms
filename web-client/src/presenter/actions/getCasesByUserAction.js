import { state } from 'cerebral';
import _ from 'lodash';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  const userId = get(state.user.userId);
  try {
    let caseList = await useCases.getCasesByUser({
      applicationContext,
      userId,
    });
    caseList = _.orderBy(caseList, 'createdAt', 'desc');
    return path.success({ caseList });
  } catch (e) {
    return path.error({
      alertError: {
        title: 'Cases not found',
        message: 'There was a problem getting the cases',
      },
    });
  }
};
