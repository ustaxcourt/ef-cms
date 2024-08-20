import { JudgeChambersInfo } from '../../../../../shared/src/proxies/users/getJudgesChambersProxy';
import {
  RawUser,
  User,
} from '../../../../../shared/src/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getUsersInSectionInteractor } from '@web-api/business/useCases/user/getUsersInSectionInteractor';

const pluralizeChambersLabel = (judgeName: string) => {
  return judgeName.endsWith('s')
    ? judgeName + '’ Chambers'
    : judgeName + '’s Chambers';
};

export const getJudgesChambersInteractor = async (
  applicationContext: ServerApplicationContext,
): Promise<JudgeChambersInfo[]> => {
  const judgeRawUsers: RawUser[] = await getUsersInSectionInteractor(
    applicationContext,
    { section: 'judge' },
  );

  const judgeUsers = User.validateRawCollection(judgeRawUsers, {
    applicationContext,
  });

  const judgeChambers: JudgeChambersInfo[] = judgeUsers.map(u => {
    const phoneNumber = u.contact?.phone;
    const label = pluralizeChambersLabel(u.name);
    return {
      // Only allow legacy judges in test environments
      isLegacy:
        u.section === 'legacyJudgesChambers' && process.env.USTC_ENV === 'prod',
      judgeFullName: u.judgeFullName,
      label,
      phoneNumber,
      section: u.section,
    } as JudgeChambersInfo;
  });

  return judgeChambers.filter(chambers => !chambers.isLegacy);
};
