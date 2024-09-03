import { RawUser } from '@shared/business/entities/User';
import { state } from '@web-client/presenter/app.cerebral';

export const getJudgeForCurrentUserAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{ judgeUser: RawUser }> => {
  const user = get(state.user);
  const judgeUser = await applicationContext
    .getUseCases()
    .getJudgeInSectionInteractor(applicationContext, {
      section: user.section,
    });

  return { judgeUser };
};
