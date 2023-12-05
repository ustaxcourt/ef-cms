import { RawUser } from '@shared/business/entities/User';

export const getJudgeForCurrentUserAction = async ({
  applicationContext,
}: ActionProps): Promise<{ judgeUser: RawUser }> => {
  const judgeUser = await applicationContext
    .getUseCases()
    .getJudgeInSectionInteractor(applicationContext, {
      section: applicationContext.getCurrentUser().section,
    });

  return { judgeUser };
};
