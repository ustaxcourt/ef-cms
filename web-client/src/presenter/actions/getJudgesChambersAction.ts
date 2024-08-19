import { isEmpty, sortBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const getJudgesChambersAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const judgesChambersCached = get(state.judgesChambers);
  if (!isEmpty(judgesChambersCached)) {
    return { judgesChambers: judgesChambersCached };
  }

  const users = await applicationContext
    .getUseCases()
    .getJudgesChambersInteractor(applicationContext);

  console.log('Getting the chambers', users);
  return {
    judgesChambers: sortBy(users, 'label'),
  };
};
