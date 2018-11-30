import { state } from 'cerebral';
import _ from 'lodash';

export default async ({ applicationContext, get, path }) => {
  const useCases = applicationContext.getUseCases();
  try {
    let caseList = await useCases.getCasesByStatus({
      applicationContext,
      userToken: get(state.user.token),
      status: 'new',
    });
    caseList = _.orderBy(caseList, 'createdAt', 'asc');
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
