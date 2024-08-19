import {
  RawUser,
  User,
} from '../../../../../shared/src/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getUsersInSectionInteractor } from '@web-api/business/useCases/user/getUsersInSectionInteractor';

// TODO: Avoid duplicating and move somewhere sensible
interface JudgeChambersInfo {
  label: string;
  judgeFullName: string;
  phoneNumber: string;
  section: string;
  isLegacy: boolean;
}

export const getJudgesChambersInteractor = async (
  applicationContext: ServerApplicationContext,
): Promise<JudgeChambersInfo[]> => {
  const judgeUsers: RawUser[] = await getUsersInSectionInteractor(
    applicationContext,
    { section: 'judge' },
  );

  User.validateRawCollection(judgeUsers, { applicationContext });

  const pluralizeChambers = (judgeName: string) => {
    if (judgeName.endsWith('s')) {
      return judgeName + '’ Chambers';
    }
    return judgeName + '’s Chamber';
  };

  const judgeChambers: JudgeChambersInfo[] = judgeUsers.map(u => {
    const phoneNumber = u.contact?.phone;
    const label = pluralizeChambers(u.name);
    return {
      isLegacy:
        u.section === 'legacyChambers' && process.env.USTC_ENV === 'prod',
      judgeFullName: u.judgeFullName,
      label,
      phoneNumber,
      section: u.section,
    } as JudgeChambersInfo;
  });

  return judgeChambers;
};
