import { getJudgeFullNameInteractor } from '@shared/proxies/trialSessionMinutes/getJudgeFullNameProxy';

export const getJudgeFullNameAction = async ({ applicationContext, props }) => {
  const { trialSession } = props;
  const { judge } = trialSession;
  const { judgeFullName } = await getJudgeFullNameInteractor(
    applicationContext,
    {
      judgeUserId: judge.userId,
    },
  );
  return {
    judgeFullName,
  };
};
