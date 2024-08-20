import { JudgeChambersInfo } from '@shared/proxies/users/getJudgesChambersProxy';
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

  const judgesChambers: JudgeChambersInfo[] = await applicationContext
    .getUseCases()
    .getJudgesChambersInteractor(applicationContext);

  console.log('Getting the chambers', judgesChambers);
  return {
    judgesChambers: sortBy(judgesChambers, 'label'),
  };
};
