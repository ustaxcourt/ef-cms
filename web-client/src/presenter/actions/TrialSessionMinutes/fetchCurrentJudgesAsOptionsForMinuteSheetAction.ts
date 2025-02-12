import { getConstants } from '@web-client/getConstants';
import { getUsersInSectionInteractor } from '@shared/proxies/users/getUsersInSectionProxy';
import { Judge } from '@shared/business/entities/trialSessionMinutes/MinuteSheet';

export const fetchCurrentJudgesAsOptionsForMinuteSheetAction = async ({
  applicationContext,
}) => {
  const { USER_ROLES } = getConstants();
  const judgeOptions: Record<string, Judge> = {};
  (
    await getUsersInSectionInteractor(applicationContext, {
      section: 'judge',
    })
  )
    .filter(judge => judge.role === USER_ROLES.judge)
    .map(judge => ({
      fullName: judge.judgeFullName!,
      title: judge.judgeTitle!,
      userId: judge.userId,
    }))
    .forEach(judge => {
      judgeOptions[judge.userId] = judge;
    });

  return { judgeOptions };
};
