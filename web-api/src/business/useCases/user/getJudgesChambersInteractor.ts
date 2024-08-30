import { JudgeChambersInfo } from '../../../../../shared/src/proxies/users/getJudgesChambersProxy';
import { RawUser } from '../../../../../shared/src/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUsersInSectionInteractor } from '@web-api/business/useCases/user/getUsersInSectionInteractor';

const pluralizeChambersLabel = (judgeName: string) => {
  return judgeName.endsWith('s')
    ? judgeName + '’ Chambers'
    : judgeName + '’s Chambers';
};

export const getJudgesChambersInteractor = async (
  applicationContext: ServerApplicationContext,
  authorizedUser: UnknownAuthUser,
): Promise<JudgeChambersInfo[]> => {
  const judgeUsers: RawUser[] = await getUsersInSectionInteractor(
    applicationContext,
    { section: 'judge' },
    authorizedUser,
  );

  const judgeChambers: JudgeChambersInfo[] = judgeUsers.map(u => {
    const phoneNumber = u.contact?.phone;
    const label = pluralizeChambersLabel(u.name);
    return {
      isLegacy: u.section === 'legacyJudgesChambers',
      judgeFullName: u.judgeFullName,
      label,
      phoneNumber,
      section: u.section,
    } as JudgeChambersInfo;
  });

  return judgeChambers.filter(chambers => !chambers.isLegacy);
};
